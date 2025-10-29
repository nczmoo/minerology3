class Input {
    click(x, y){
		let can_i_go_here = game.player.can_i_go_here(x, y);
		if (game.buying == null && can_i_go_here){
			game.player.go_here(x, y);
			return;
		}
		if (game.buying == null && !can_i_go_here){
			return null;
		}
		let can_i_place = game.buildings.can_i_place(x, y, game.buying);
		if (game.buying != null && !can_i_place){
			return null;
		}
		if (game.buying == 'dynamite'){
			game.buildings.build(x, y, x, y, game.buying);
			game.buying = null;
			ui.refresh();
			console.log('refresh');
			return;
		}
		if (game.player.build_from == null && can_i_place){
			game.player.build_from = { x : x, y: y };
			$("#cell-" + x + "-" + y).addClass('building_from');
			return;
		}
		game.buildings.build(game.player.build_from.x, game.player.build_from.y, x, y, game.buying);
		game.player.build_from = null;
		game.buying = null;
		ui.refresh();
	}

	input(key){
		if (key == "ArrowLeft"){
			game.player.move ("left");
		} else if (key == "ArrowRight"){
			game.player.move ('right');
		} else if (key == 'ArrowDown'){
			game.player.move ('down');
		} else if (key == 'ArrowUp'){
			game.player.move ('up');
		}
	}

}