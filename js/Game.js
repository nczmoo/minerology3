class Game{
	loop = null;
	buildings = null;
	day = 1;
	input = new Input();
	map = new Map();
	
	constructor(){
		this.loop = new Loop();
		this.map = new Map();
		this.buildings = new Building();
		this.player = new Player();
		this.input = new Input();
		// run loop periodically - pass a function reference
		setInterval(() => this.loop.go(), Config.loop_interval_timing);
	}

	// convenience proxies so older code that references game.money / game.moves etc still works
	get money(){ return this.player.money }
	set money(v){ this.player.money = v }

	get moves(){ return this.player.moves }
	set moves(v){ this.player.moves = v }

	get expenses(){ return this.player.expenses }
	set expenses(v){ this.player.expenses = v }

	get buying(){ return this.player.buying }
	set buying(v){ this.player.buying = v }

	get player_at(){ return this.player.player_at }
	set player_at(v){ this.player.player_at = v }

	// delegate common actions to subsystems
	click(x, y){ return this.input.click(x, y); }
	buy(what){ return this.player.buy(what); }
	input(key){ return this.input.input(key); }

	are_they_falling(x, y){
		if (!this.map.is_pos_valid(x, y + 1)){
			return false;
		}
		if (this.map.grid[x][y + 1] == 'empty' && this.buildings.at(x, y) == null){
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
