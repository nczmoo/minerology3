class Building{
   	build_from = null;
   	count = 0;
	grid = [];
	constructor(){
		this.grid = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => null) );				
	}
	at (x, y){
		return this.grid[x][y];
	}

    build (from_x, from_y, to_x, to_y, what){		
		let delta = this.fetch_delta(from_x, from_y, to_x, to_y);
		let cost = Config.costs[what];		
		let pos_x = from_x;
		let pos_y = from_y;		
		while(true){
			if (this.money < cost ){
				return false;
			}
			this.grid[pos_x][pos_y] = what;
			this.count ++;
			this.money -= cost;	
			console.log(this.money, this.count, what);		
			pos_x += delta.x;
			pos_y += delta.y;
			if (pos_x == to_x + delta.x && pos_y == to_y + delta.y){
				return true;
			}
		}
	}

    can_i_place(x, y, what){
		if (this.buying != 'dynamite' && this.map.grid[x][y] != 'empty'){
			return false;
		}

		if (what == 'ladder' && (y == Config.dirt_starts_at || this.map.grid[x][y - 1] != 'empty' 
			|| (this.map.is_pos_valid(x, y + 1) && this.map.grid[x][y + 1] != 'empty') || y == Config.max_y - 1)){
				return true;
		} else if (what == 'shoring' && (!this.are_they_falling(x, y))){
			return true;
		} else if (what == 'dynamite' && this.map.grid[x][y] != 'empty' && this.map.grid[x][y] != 'sky' 
			&& this.map.is_it_within_range_of_tile_type(x, y, 2, 'empty', false)){
			return true;
		}
		console.log(this.map.is_it_within_range_of_tile_type(x, y, 2, 'empty', false));
		return false;
	}

    is_within_range_of_building(x, y, range, building){
		for (let pos_x = x - range; pos_x <= x + range; pos_x ++){
			for (let pos_y = y - range; pos_y <= y + range; pos_y ++){
				if (!this.map.is_pos_valid(pos_x, pos_y)){
					continue;
				}
				if (this.at(pos_x, pos_y) == building){
					return true;
				}
			}
		}
		return false;
	}
}