class Input {
    click(x, y){
		let can_i_go_here = game.player.can_i_go_here(x, y);
		if (this.buying == null && can_i_go_here){
			this.go_here(x, y);
			return;
		}
		if (this.buying == null && !can_i_go_here){
			return null;
		}
		let can_i_place = game.buildings.can_i_place(x, y, this.buying);
		if (this.buying != null && !can_i_place){
			return null;
		}
		if (this.buying =='dynamite'){
			this.build(x, y, x, y, this.buying);
			this.buying = null;
			
			ui.refresh();
			console.log('refresh');
			return;
		}
		if (game.player.build_from == null && can_i_place){
			game.player.build_from = { x : x, y: y };
			$("#cell-" + x + "-" + y).addClass('game.player.build_from');
			return;
		}
		this.build(this.game.player.build_from.x, this.game.player.build_from.y, x, y, this.buying);
		game.player.build_from = null;
		this.buying = null;
		ui.refresh();
	}

    input(key){

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
}