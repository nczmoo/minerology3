class Map {
    grid = [];
    constructor(){
        this.grid = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => 'empty') );
		this.generate_map();
    }

    create_tile(x, y){
		if (y < 3) {
			return 'sky';
		} else if (y < 6 || (y >= 6 && this.grid[x][y-1] == 'dirt' && fetch_rand(1, 2) == 1)){

			return "dirt";
		}

		return 'stone';
	};

    dirt_column_falls(base_x, base_y){
		console.log('column falls', base_x, base_y);
		let top_dirt_y = this.fetch_top_tile_y(base_x, base_y, 'dirt');
		if (!this.is_pos_valid(base_x, base_y - 1)){
			return;
		}
		this.grid[base_x][top_dirt_y] = 'empty';
		this.grid[base_x][base_y + 1] = 'dirt';


	}

	dirt_collapses(){
		console.log('collapses');
		let num_collapsed = 0;
		for (let x = 0; x < Config.max_x; x ++ ){
			for (let y = 0; y < Config.max_y - 1; y++){
				//console.log(x, y);
				if (this.grid[x][y] != 'dirt'){
					continue;
				}
				if (this.is_pos_valid(x - 1, y + 1) && this.grid[x - 1][y + 1] == 'empty'){
					this.grid[x][y] = 'empty';
					this.grid[x - 1][y + 1] = 'dirt';
					num_collapsed ++;
				} else if (this.is_pos_valid(x + 1, y + 1) && this.grid[x + 1][y + 1] == 'empty'){
					this.grid[x][y] = 'empty';
					this.grid[x + 1][y + 1] = 'dirt';
					num_collapsed ++;
				}
			}
		}
		console.log(num_collapsed);
		if (num_collapsed > 0){
			this.dirt_falls();
			this.dirt_collapses();
		}
	}

	dirt_falls(){
		for (let x = 0; x < Config.max_x; x ++){
			for (let y = 1; y <= Config.max_y; y ++){
				if ( this.grid[x][y] == "empty" && this.grid[x][y - 1] == "dirt"){
					this.dirt_column_falls(x, y - 1);
				}
			}	
		}
	}

    fetch_top_tile_y(x, y, type){
		let new_y = y;
		while (true){						
			if (this.grid[x][new_y] != type){
				return new_y + 1;
			}
			new_y --;
		}
	}

	fetch_adjacent_tile(x, y, type){
		//orthogonal
		let relevant = [];
		for (let pos_x = x - 1; pos_x <= x + 1; pos_x ++){
			for (let pos_y = y - 1; pos_y <= y + 1; pos_y ++){	
				if (!this.is_pos_valid(pos_x, pos_y) || (pos_x == x && pos_y == y) || (pos_x != x && pos_y != y)){
					continue;
				}
				if (this.grid[pos_x][pos_y] == type){
					relevant.push({x : pos_x, y: pos_y});
				}
			}		
		}
		if (relevant.length == 0){
			return null;
		}
		return relevant[fetch_rand(0, relevant.length - 1)];
	}

	generate_map(){
		for (let x = 0; x < Config.max_x; x ++){
			for (let y = 0; y < Config.max_y; y ++){
				this.grid[x][y] = this.create_tile(x, y);
			}
		}
		this.seed_map();
	}

	grow_ore(type, x, y){
		let growth = {gold: 10, iron: 3, coal: 2};
		let does_it_grow = fetch_rand (1, growth[type]) == 1;
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

    is_pos_valid (x, y){
		return !( x < 0 || x >= Config.max_x || y < 0 || y >= Config.max_y);
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
		let num_of_ores = {};		
		for (let [type, cent] of Object.entries(seeds) ){						 
			this.seed_all_ores(type, cent * map_size);
		}
 
		
	}
}