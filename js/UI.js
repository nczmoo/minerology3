class UI{
	
	constructor(){

	}

	display_map() {
    	let txt = Array.from({ length: Config.max_y }, (_, y) =>  // rows
    		`<div class="row">` +
    		Array.from({ length: Config.max_x }, (_, x) => {       // cells
        		const tile_type = game.map.grid[x][y];                 // get tile type from map
				let html_txt = "&nbsp;"
				let tile_modifier = '';
				if (game.buildings.is_within_range_of_building(x, y, 1, 'dynamite')){
					tile_modifier = 'pending_destruction';

				}
				if (x == game.player_at.x && y == game.player_at.y && game.moves < Config.max_moves){
					html_txt = "O";
				} else if (game.buildings[x][y] != null){
					html_txt = Config.building_icons[game.buildings[x][y]];
				} else if (game.map.falling[x][y] != null){
					html_txt = game.map.falling[x][y];
				}
        		return `<div id='cell-${x}-${y}' class="cell ${tile_type} ${tile_modifier}">${html_txt} </div>`;   // add as class
    		}).join('') + `</div>`
			).join('');

		$("#map").html(txt);

	}

	flash(id, color){
		let og_color = $("#" + id).css('color');
		$("#" + id).css('color', color);
		setTimeout(() => {
			$("#" + id).css('color', og_color)
			}, Config.flash_delay)

	}

	generate_buy_menu(){
		let htmlTxt = '';
		for (let [what, cost] of Object.entries(Config.costs)){
			let disabledTxt = "disabled";
			if (game.money >= cost && game.moves >= Config.max_moves){
				disabledTxt = '';
			}
			htmlTxt += `<button id='buy-${what}' class='buy' ${disabledTxt}>
				${Config.building_icons[what]}</button> $<span id='cost-${what}'>${cost}</span>`;			
		}
		$("#buy_menu").html(htmlTxt);
	}

	highlight(x, y){
		let cost = Config.costs[game.buying];
		let max_i = Math.floor(game.money / cost);
		let delta = game.fetch_delta(game.player.build_from.x, game.player.build_from.y, x, y);
		
		if ((delta.x == 0 && delta.y == 0) || (delta.x != 0 && delta.y != 0)){
			return;
		}
		let i = 0;
		let pos_x = game.player.build_from.x;
		let pos_y = game.player.build_from.y;
		while(true){
			$(`#cell-${pos_x}-${pos_y}`).html("[]");
			$(`#cell-${pos_x}-${pos_y}`).addClass("buying");
			$(`#cell-${pos_x}-${pos_y}`).addClass("building_from");

			if (pos_x == x && pos_y == y){
				return true;
			}
			pos_x += delta.x;
			pos_y += delta.y;
			i ++;
			if (i >= max_i){
				return false;
			}
			
		}
		
	}
	highlight_dynamite(x, y){
		for (let pos_x = x -1; pos_x <= x + 1; pos_x ++){
			for (let pos_y = y -1; pos_y <= y + 1; pos_y ++){
				if (!game.map.is_pos_valid(x, y)){
					continue;
				}
				$(`#cell-${pos_x}-${pos_y}`).addClass('dynamite-highlight');
			}	
		}
	}

	hover(x, y){
		let can_i_go_here = game.can_i_go_here(x, y);
		let can_i_place = game.buildings.can_i_place(x, y, game.buying);
		//console.log(game.buying, can_i_place, x, y);
		/*
		console.log((game.buying == null && x != game.player_at.x && game.player_at.y != y), 
			(game.buying == null && !can_i_go_here),
			(game.buying != null && game.buying != 'dynamite' && !$("#cell-" + x + "-" + y).hasClass('empty')),
			(game.buying != null && game.player.build_from == null && !can_i_place))
			*/
		if ((game.buying == null && x != game.player_at.x && game.player_at.y != y) 
			|| (game.buying == null && !can_i_go_here)
			|| (game.buying != null && game.buying != 'dynamite' && !$("#cell-" + x + "-" + y).hasClass('empty'))
			|| (game.buying != null && game.player.build_from == null && !can_i_place)){
			return;
		}


		if (game.buying == null && can_i_go_here){
			$("#cell-" + x + "-" + y).html('O');	
			return;
		}

		let finished_highlighting = true;
		if (game.player.build_from != null){
			finished_highlighting = this.highlight(x, y);
		}
		if (!finished_highlighting){
			return;
		}


		$("#cell-" + x + "-" + y).html(Config.building_icons[game.buying]);
		if (game.buying == 'dynamite'){
			this.highlight_dynamite(x, y);
			return;
		}
		$(".cell:not(.building_from)").removeClass('buying');
		$("#cell-" + x + "-" + y).addClass('buying');
	}

	leave(x, y){
		if (game.building != null 
			&& (!$("#cell-" + x + "-" + y).hasClass('empty') || $("#cell-" + x + "-" + y).hasClass('building_from'))){
			return;
		}
		$("#cell-" + x + "-" + y).removeClass('buying');
		if ((game.player_at.x == x && game.player_at.y == y) || game.buildings[x][y] != null){			
			return;
		}		
		$("#cell-" + x + "-" + y).html('');
		$(".cell").removeClass('dynamite-highlight');		
	}

	refresh(){
		this.generate_buy_menu();
		this.display_map();
		let balance = game.money - game.expenses;
		$("#balance").css('color', 'black');
		if (balance < 0){
			$("#balance").css('color', 'red');
		}
		$("#balance").html(balance);
		$("#expenses").html(game.expenses);
		$("#money").html(game.money);
		$("#moves_left").html(Config.max_moves - game.moves);	
		$("#day").html(game.day);
		if (game.moves >= Config.max_moves){
			$("#next").prop('disabled', false);
			$("#money_stats").css('visibility', 'hidden');
		} else if (game.moves == 0){
			$("#next").prop('disabled', true);
			$(".buy").prop('disabled', true);
			$("#money_stats").css('visibility', 'visible');

		}
	
		
	}
}
