class Input {
    click(x, y){
		let can_i_go_here = game.player.can_i_go_here(x, y);
		if (game.player.buying == null && can_i_go_here){
			game.player.go_here(x, y);
			return;
		}
		if (game.player.buying == null && !can_i_go_here){
			return null;
		}
		let can_i_place = game.buildings.can_i_place(x, y, game.player.buying);
		if (game.player.buying != null && !can_i_place){
			return null;
		}
		if (game.player.buying =='dynamite'){
			this.build(x, y, x, y, game.player.buying);
			game.player.buying = null;
			
			ui.refresh();
			console.log('refresh');
			return;
		}
		if (game.player.build_from == null && can_i_place){
			game.player.build_from = { x : x, y: y };
			$("#cell-" + x + "-" + y).addClass('building_from');
			return;
		}
		this.build(this.game.player.build_from.x, this.game.player.build_from.y, x, y, game.player.buying);
		game.player.build_from = null;
		game.player.buying = null;
		ui.refresh();
	}

    type(key){

		if (key == "ArrowLeft"){
			game.player.move ("left");
			game.player.move ("left");
		} else if (key == "ArrowRight"){
			game.player.move ('right');
			game.player.move ('right');
		} else if (key == 'ArrowDown'){
			game.player.move ('down');
			game.player.move ('down');
		} else if (key == 'ArrowUp'){
			game.player.move ('up');			
		}
	}

}