$(document).on('click', '.cell', function(e){
	let x = Number(e.target.id.split('-')[1]);
	let y = Number(e.target.id.split('-')[2]);
	game.click(x, y);

})
$(document).on('click', '.buy', function(e){
	game.buy(e.target.id.split('-')[1]);
})


$(document).on('keydown', 'body', function(e){
	game.input(e.key);
	ui.refresh();

})

$(document).on('mouseover', '.cell', function(e){	
	let x = Number(e.target.id.split('-')[1]);
	let y = Number(e.target.id.split('-')[2]);
	ui.hover(x, y);
})
$(document).on('mouseleave', '.cell', function(e){	
	let x = Number(e.target.id.split('-')[1]);
	let y = Number(e.target.id.split('-')[2]);
	ui.leave(x, y);
})


$(document).on('click', '#next', function(e){
	game.next_day();
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
