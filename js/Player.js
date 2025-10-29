class Player{
   	buying = null;
	expenses = 0;
    player_at = {x: Config.start_x, y: Config.start_y};
	money = 2000;	
	moves = 0;
	constructor(){
		this.calculate_expenses();

	}
    buy (what){
		let cost = Config.costs[what];
		if (this.money < cost){			
			return;
		}
		if (this.buying != null){
			this.buying = null;
			return;
		}
		this.buying = what;

	}

	calculate_expenses(){
		this.expenses = Config.miner_wage + game.buildings.count;
	}

    can_i_go_here(x, y){
		let delta = this.fetch_delta(this.player_at.x, this.player_at.y, x, y);
		if (delta.x != 0 && delta.y != 0){
			return false;
		}
		let pos_x = this.player_at.x;
		let pos_y = this.player_at.y;
		let possible_moves = 0;
		while (true){
			if (this.are_they_falling(pos_x, pos_y)){
				return false;
			}
			if (delta.y == -1 && game.buildings.at(pos_x, pos_y) != 'ladder' 
				&& this.map.grid[pos_x][pos_y - 1] == 'empty' ){
				return false;
			}
			if (this.map.grid[pos_x][pos_y] != "dirt" 
				&& this.map.grid[pos_x][pos_y] != 'sky' && this.map.grid[pos_x][pos_y] != 'empty'){
				possible_moves ++;
			}
			if (pos_x == x && pos_y == y){
				return true;
			} else if (possible_moves > Config.max_moves){
				return false;
			}


			pos_x += delta.x;
			pos_y += delta.y;
		}
	}

    dig(x, y){
		let type = this.map.grid[x][y];
		this.map.grid[x][y] = 'empty';
		this.map.falling[x][y] = null;
		this.money += Config.ore_values[type];
		this.fall(false);
		if (type == 'dirt'){
			return;
		}
		this.moves ++;
		if (this.moves >= Config.max_moves){
			this.money -= this.expenses;
		}
		if (this.money < 0){
			this.lose();
		}
	}

    fall(decrement){
		//check if player falls
		let new_y = this.player_at.y + 1;
		let is_tile_below_valid = this.map.is_pos_valid(this.player_at.x, new_y)
		if (!is_tile_below_valid || game.buildings.at(this.player.x, this.player.y) == 'ladder'
			||  (is_tile_below_valid && this.map.grid[this.player_at.x][new_y] != 'empty')){
			return;
		}
		this.player_at.y = new_y;
		if (decrement){
			this.moves ++;
		}
		this.fall(decrement);

	}

	fetch_direction (delta){
		if (delta.x == -1){
			return 'left';
		} else if (delta.x == 1){
			return 'right';
		} else if (delta.y == -1){
			return 'up';
		} else if (delta.y == 1){
			return 'down';
		}		
	}

    go_here(x, y){
		let delta = this.fetch_delta(this.player_at.x, this.player_at.y, x, y);
		if (delta.x != 0 && delta.y != 0){
			return false;
		}
		let direction = this.fetch_direction(delta);
		let pos_x = this.player_at.x;
		let pos_y = this.player_at.y;
		while (true) {
			this.move(direction);
			if (pos_x == this.player_at.x && pos_y == this.player_at.y && direction == 'up'
				|| (this.player_at.x == x && this.player_at.y == y)
				|| this.moves >= Config.max_moves){
				break;
			}
		}
		ui.refresh();
	}

    move (direction){
		let delta_x = 0;
		let delta_y = 0;
		if (direction == 'left'){
			delta_x = -1;
		} else if (direction == 'right'){
			delta_x = 1;
		}
		if (direction == 'down'){
			delta_y = 1
		} else if (direction == 'up'){
			delta_y = -1;
		}

		if (this.moves >= Config.max_moves 
			|| (direction == 'up' && game.buildings.at(this.player.x, this.player.y) == 'ladder')
			|| !this.map.is_pos_valid(this.player_at.x + delta_x, this.player_at.y + delta_y)){
			return;
		}
		let new_x = this.player_at.x + delta_x;
		let new_y = this.player_at.y + delta_y;
		
		if (this.map.grid[new_x][new_y] == 'sky' || this.map.grid[new_x][new_y] == 'empty'){
			this.player_at.x = new_x;
			this.player_at.y = new_y;
			this.fall(true);
			return;
		}
		this.dig(new_x, new_y);
	}
}