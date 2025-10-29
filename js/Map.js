class Map {
	event = new MapEvent();
	falling = [];
	generator = new MapGenerator();
	grid = [];
	tile = new Tile();
    constructor(){
        this.grid = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => 'empty') );
		this.falling = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => null) );
		this.generator.generate();
    }
	
	at (x, y){
		return this.grid[x][y];
	}

	is_pos_valid (x, y){
		return !( x < 0 || x >= Config.max_x || y < 0 || y >= Config.max_y);
	}

	is_it_within_range_of_tile_type(x, y, range, type, inclusive){
		for (let pos_x = x - range; pos_x <= x + range; pos_x ++){
			for (let pos_y = y - range; pos_y <= y + range; pos_y ++){
				if (!this.is_pos_valid(pos_x, pos_y) 
					|| (!inclusive && pos_x > x - range && pos_x < x + range 
						&& pos_y > y - range && pos_y < y + range )){
					continue;
				}
				if (this.at(pos_x, pos_y) == type){
					return true;
				}
			}    
		}
		return false;
	}

	/* Map generator methods (migrated from MapGenerator.js) */
	generate_map(){
		for (let x = 0; x < Config.max_x; x ++){
			for (let y = 0; y < Config.max_y; y ++){
				this.grid[x][y] = this.create_tile(x, y);
			}
		}
		this.seed_map();
	}

	grow_ore(type, x, y){
		let growth_max = { gold: 10, iron: 2, coal: 10 };
		let growth_target = { gold: 1, iron: 1, coal: 9 };
		let does_it_grow = fetch_rand (1, growth_max[type]) <= growth_target[type];
		if (!does_it_grow){
			return false;
		}
		let adjacent = this.fetch_adjacent_tile(x, y, 'stone');
		if (adjacent == null){
			return false;
		}
		this.grid[adjacent.x][adjacent.y] = type;
		this.grow_ore(type, x, y);
	}

	seed_all_ores(type, num_of_ores){
		let min_y = {gold: Math.round(Config.max_y / 2), coal: 4, iron: 4};
		for (let n = 0; n < num_of_ores; n ++){
			let x = fetch_rand(0, Config.max_x - 1);
			let y = fetch_rand(min_y[type], Config.max_y - 1)
			this.grid[x][y] = type;
			this.grow_ore(type, x, y);
		}
	}

	seed_map(){
		let seeds = {gold: .005, iron: .025, coal: .05};
		let map_size = Config.max_x * Config.max_y;
		for (let [type, cent] of Object.entries(seeds) ){                         
			this.seed_all_ores(type, Math.floor(cent * map_size));
		}
	}

	/* Map event methods (migrated from MapEvent.js) */
	check_gravity(){
		for (let x = 0; x < Config.max_x; x ++ ){
			for (let y = 0; y < Config.max_y - 1; y++){
				if (this.grid[x][y] == 'empty' || this.grid[x][y] == 'sky'){
					continue;
				}
				if (this.falling[x][y] != null){
					this.tile_falls(x, y);
					continue;
				}
				if (this.grid[x][y + 1] == 'empty'){
					this.falling[x][y] = Config.init_falling;
				}
			}
		}
		this.dirt_falls();
	}

	column_falls(base_x, base_y, type){
		let top_tile_y = this.fetch_top_tile_y(base_x, base_y, type);
		if (!this.is_pos_valid(base_x, base_y + 1)){
			return;
		}
		this.grid[base_x][top_tile_y] = 'empty';
		this.grid[base_x][base_y + 1] = type;
		if (this.is_pos_valid(base_x, base_y + 2) && this.grid[base_x][base_y + 2] == 'empty'){
			this.column_falls(base_x, base_y + 1, type);
		}

	}

	dirt_collapses(){
		let num_collapsed = 0;
		for (let x = 0; x < Config.max_x; x ++ ){
			for (let y = 0; y < Config.max_y - 1; y++){
				if (this.grid[x][y] != 'dirt'){
					continue;
				}
				if (this.is_pos_valid(x - 1, y + 1) && this.grid[x - 1][y + 1] == 'empty' 
					&& game.buildings.at(x - 1, y + 1) == null){
					this.grid[x][y] = 'empty';
					this.grid[x - 1][y + 1] = 'dirt';
					num_collapsed ++;
				} else if (this.is_pos_valid(x + 1, y + 1) && this.grid[x + 1][y + 1] == 'empty' 
					&& game.buildings.at(x + 1, y + 1) == null){
					this.grid[x][y] = 'empty';
					this.grid[x + 1][y + 1] = 'dirt';
					num_collapsed ++;
				}
			}
		}
		if (num_collapsed > 0){
			this.dirt_falls();
			this.dirt_collapses();
		}
	}

	dirt_falls(){
		for (let x = 0; x < Config.max_x; x ++){
			for (let y = 1; y < Config.max_y; y ++){
				if ( this.grid[x][y] == "empty" && game.buildings.at(x, y) == null 
					&& this.grid[x][y - 1] == "dirt"){
					this.column_falls(x, y - 1, 'dirt');
				}
			}    
		}
	}

	explode(){
		let dynamites = [];
		for (let pos_x = 0; pos_x < Config.max_x ; pos_x ++){
			for (let pos_y = 0; pos_y < Config.max_y; pos_y ++){
				if (!this.is_pos_valid(pos_x, pos_y) 
					|| !game.buildings.is_within_range_of_building(pos_x, pos_y, 1, 'dynamite')){
					continue;
				}
				if (game.buildings.at(pos_x, pos_y) == 'dynamite'){
					dynamites.push( { x: pos_x, y: pos_y } );
				}
				let value = Config.ore_values[this.at(pos_x, pos_y)];
				game.money += value;
				this.grid[pos_x][pos_y] = 'empty';
			}
		}
		for (let dynamite of dynamites){
			game.buildings.grid[dynamite.x][dynamite.y] = null;
		}
	}

}