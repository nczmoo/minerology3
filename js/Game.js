class Game{
	loop = new Loop();
	day = 1;
	map = new Map();
	money = 0;
	moves = 0;
	player_at = {x: Config.start_x, y: Config.start_y};
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
		
	}

	

	dig(x, y){
		let type = this.map.grid[x][y];
		this.map.grid[x][y] = 'empty';
		this.money += Config.ore_values[type];
		this.fall();
		if (type == 'dirt'){
			return;
		}
		this.moves ++;
	}
	
	fall(){
		//check if player falls
		let new_y = this.player_at.y + 1;
		let is_tile_below_valid = this.is_pos_valid(this.player_at.x, new_y)
		if (!is_tile_below_valid ||  (is_tile_below_valid && this.map.grid[this.player_at.x][new_y] != 'empty')){
			return;
		}
		this.player_at.y = new_y;
		this.fall();

	}

	

	input(key){
		console.log(key);

		if (key == "ArrowLeft"){
			this.move ("left");
		} else if (key == "ArrowRight"){
			this.move ('right');
		} else if (key == 'ArrowDown'){
			this.move ('down');
		} else if (key == 'ArrowUp'){
			this.move ('up');			
		}
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
		if (this.moves >= Config.max_moves || !this.is_pos_valid(this.player_at.x + delta_x, this.player_at.y + delta_y)){
			return;
		}
		let new_x = this.player_at.x + delta_x;
		let new_y = this.player_at.y + delta_y;
		if (this.map.grid[new_x][new_y] == 'sky' || this.map.grid[new_x][new_y] == 'empty'){
			this.player_at.x = new_x;
			this.player_at.y = new_y;
			this.fall();
			return;
		}
		this.dig(new_x, new_y);
	}

	next_day(){
		this.dirt_falls();
		this.dirt_collapses();
		this.player_at.x = Config.start_x;
		this.player_at.y = Config.start_y;
		this.fall();
		this.moves = 0;
		this.day ++;
	}


}
