$(document).on('click', '', function(e){

})

$(document).on('keydown', 'body', function(e){
	game.input(e.key);
	ui.refresh();

})

$(document).on('click', '#next', function(e){
	game.next_day();
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
