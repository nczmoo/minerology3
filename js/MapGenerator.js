class MapGenerator {

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
		let num_of_ores = {};		
		for (let [type, cent] of Object.entries(seeds) ){						 
			this.seed_all_ores(type, cent * map_size);
		}
 
		
	}
}