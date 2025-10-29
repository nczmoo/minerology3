function fetch_rand(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

game = new Game()
ui = new UI()
ui.refresh()