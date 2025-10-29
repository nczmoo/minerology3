class Game{
	loop = new Loop();
	buildings = new Building();
	day = 1;
	input = new Input();
	map = new Map();
	
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);		
	}

	are_they_falling(x, y){
		if (!this.map.is_pos_valid(x, y + 1)){
			return false;
		}
		if (this.map.grid[x][y + 1] == 'empty' && this.buildings.at(x, y) == 'null'){
			return true;
		}

		return false;
	}



	fetch_delta(from_x, from_y, to_x, to_y){
		let delta_x = to_x - from_x;
		let delta_y = to_y - from_y;
		
		if (delta_y > 0){
			delta_y = 1;
		} else if (delta_y < 0){
			delta_y = -1;
		}
		if (delta_x > 0){
			delta_x = 1;
		} else if (delta_x < 0){
			delta_x = -1;
		}

		return { x: delta_x, y: delta_y };
	}
	
	lose(){
		console.log ("YOU LOST");
	}

	next_day(){
		game.player.next_day();
		
		this.map.event.go();
		
		
		this.day ++;
	}

	

}
