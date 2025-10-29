class Tile{
    create_tile(x, y){
		if (y < Config.dirt_starts_at ) {
			return 'sky';
		} else if (y < 6 || (y >= 6 && this.grid[x][y-1] == 'dirt' && fetch_rand(1, 2) == 1)){
			return "dirt";
		}

		return 'stone';
	};

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

    tile_falls(x, y){
		this.falling[x][y] --;
		if(this.falling[x][y] < 1){
			this.falling[x][y] = null;
			this.column_falls(x, y, this.grid[x][y]);
		}
	}
}