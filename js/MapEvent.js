class MapEvent {
    check_gravity(){
		console.log('gravity');
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
					console.log(x, y);
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
					&& game.buildings[x - 1][y + 1] == null){
					this.grid[x][y] = 'empty';
					this.grid[x - 1][y + 1] = 'dirt';
					num_collapsed ++;
				} else if (this.is_pos_valid(x + 1, y + 1) && this.grid[x + 1][y + 1] == 'empty' 
					&& game.buildings[x + 1][y + 1] == null){
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
			for (let y = 1; y <= Config.max_y; y ++){
				if ( this.grid[x][y] == "empty" && game.buildings[x][y] == null 
					&& this.grid[x][y - 1] == "dirt"){
					this.column_falls(x, y - 1, 'dirt');
				}
			}	
		}
	}

	explode(){
		let dynamites = [];
		for (let pos_x = 0; pos_x < Config.max_x ; pos_x ++){
			for (let pos_y = 0; pos_y < Config.max_x; pos_y ++){
				if (!this.map.is_pos_valid(pos_x, pos_y) 
					|| !game.buildings.is_within_range_of_building(pos_x, pos_y, 1, 'dynamite')){
					continue;
				}
				if (game.buildings.at(pos_x, pos_y) == 'dynamite'){
					dynamites.push( { x: pos_x, y: pos_y } );
				}
				let value = Config.ore_values[this.map.at(pos_x, pos_y)];
				this.money += value;
				this.map.grid[pos_x][pos_y] = 'empty';
			}
		}
		for (let dynamite of dynamites){
			game.buildings.grid[dynamite.x][dynamite.y] = null;
		}
	}
}