class Map {
	falling = [];
	grid = [];
    constructor(){
        this.grid = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => 'empty') );
		this.falling = Array.from({ length: Config.max_x }, 
			() => Array.from({ length: Config.max_y }, 
				() => null) );
		this.generate_map();
    }
	
	at (x, y){
		return this.grid[x][y];
	}

    is_pos_valid (x, y){
		return !( x < 0 || x >= Config.max_x || y < 0 || y >= Config.max_y);
	}

	is_it_within_range_of_tile_type(x, y, range, type, inclusive){
		//console.log('range', x, y, type, range, inclusive);

		//console.log(x - range, x + range, x - range <= x + range)
		for (let pos_x = x - range; pos_x <= x + range; pos_x ++){
			for (let pos_y = y - range; pos_y <= y + range; pos_y ++){
				//console.log(pos_x, pos_y, inclusive, )
				if (!this.is_pos_valid(pos_x, pos_y) 
					|| (!inclusive && pos_x > x - range && pos_x < x + range 
						&& pos_y > y - range && pos_y < y + range )){
					continue;
				}
				//console.log(pos_x, pos_y, this.at(pos_x, pos_y));
				if (this.at(pos_x, pos_y) == type){
					return true;
				}
			}	
		}
		return false;
	}



	
}