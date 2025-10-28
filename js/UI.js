class UI{
	constructor(){

	}

	display_map() {
    	let txt = Array.from({ length: Config.max_y }, (_, y) =>  // rows
    		`<div class="row">` +
    		Array.from({ length: Config.max_x }, (_, x) => {       // cells
        		const tile_type = game.map.grid[x][y];                 // get tile type from map
				let html_txt = "&nbsp;"
				if (x == game.player_at.x && y == game.player_at.y){
					html_txt = "O";
				}
        		return `<div class="cell ${tile_type}">${html_txt} </div>`;   // add as class
    		}).join('') + `</div>`
			).join('');

		$("#map").html(txt);

	}

	

	refresh(){
		this.display_map();
		$("#money").html(game.money);
		$("#moves_left").html(Config.max_moves - game.moves);	
		$("#day").html(game.day);
		if (game.moves >= Config.max_moves){
			$("#next").prop('disabled', false);
		} else if (game.moves == 0){
			$("#next").prop('disabled', true);
		}
	}
}
