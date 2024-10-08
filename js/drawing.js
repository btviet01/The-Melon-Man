// Functions responsible for drawing on canvas

game.drawTile = function (tileColumn, tileRow, x, y) {
	game.context.drawImage(
		game.textures,
		tileColumn * game.options.tileWidth,
		tileRow * game.options.tileHeight,
		game.options.tileWidth,
		game.options.tileHeight,
		x * game.options.tileWidth - Math.round(game.player.x) + Math.round(game.options.canvasWidth / 2 + game.options.tileWidth / 2),
		y * game.options.tileHeight - Math.round(game.player.y) + Math.round(game.options.canvasHeight / 2 + game.options.tileHeight / 2),
		game.options.tileWidth,
		game.options.tileHeight
	)
}

game.drawStructure = function (name, x, y) {
	var structure = game.structures[name]
	for (var i = 0; i < structure.length; i++) {
		game.drawTile(structure[i].tileColumn, structure[i].tileRow, structure[i].x + x, structure[i].y + y)
	}
}

game.drawPlayer = function () {
    var playerSize = game.options.tileWidth*0.7; 
    var drawX = Math.round(game.options.canvasWidth / 2 - playerSize / 2);
    var drawY = Math.round(game.options.canvasHeight / 2 - playerSize / 2);
    game.context.fillStyle = "red";
    game.context.fillRect(drawX, drawY, playerSize, playerSize);
	game.context.fillStyle="black";
	game.context.beginPath();
	game.context.arc(drawX + playerSize *0.3, drawY+playerSize*0.3,playerSize*0.1,0,Math.PI*2);
	game.context.fill();
	game.context.beginPath();
	game.context.arc(drawX + playerSize *0.7, drawY+playerSize*0.3,playerSize*0.1,0,Math.PI*2);
	game.context.fill();
};


game.redraw = function () {
	game.drawPending = false

	// Draw the background
	if (game.backgrounds['sky'].loaded) {
		var pattern = game.context.createPattern(game.backgrounds['sky'].image, 'repeat') // Create a pattern with this image, and set it to "repeat".
		game.context.fillStyle = pattern
	} else {
		game.context.fillStyle = "#78c5ff"
	}

	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height)

	if (game.backgrounds['trees'].loaded) {
		game.context.drawImage(game.backgrounds['trees'].image, 0, game.canvas.height / 2 - game.player.y / 10, 332, 180)
		game.context.drawImage(game.backgrounds['trees'].image, 332, game.canvas.height / 2 - game.player.y / 10, 332, 180)
	}

	// List nearest structures
	var structuresToDraw = []
	var drawing_distance = 15
	for (var i = 0; i < game.map.structures.length; i++) {
		if (
			game.map.structures[i].x > (game.player.x / game.options.tileWidth) - drawing_distance
			&& game.map.structures[i].x < (game.player.x / game.options.tileWidth) + drawing_distance
			&& game.map.structures[i].y > (game.player.y / game.options.tileHeight) - drawing_distance
			&& game.map.structures[i].y < (game.player.y / game.options.tileHeight) + drawing_distance
		) {
			structuresToDraw.push(game.map.structures[i])
		}
	}

	// Draw them
	for (var i = 0; i < structuresToDraw.length; i++) {
		game.drawStructure(structuresToDraw[i].name, structuresToDraw[i].x, structuresToDraw[i].y)
	}

	// Draw the player
	game.drawPlayer()
	game.context.font="20px superscript"
	game.context.fillStyle="red"
	game.context.textAlign = "left"
	score=Math.round(-game.player.highestY / (3 * game.options.tileHeight))
	game.context.fillText("Score:"+score, game.canvas.width -400 , game.canvas.height - 150)

	game.counter.innerHTML = "A game by Karol Swierczek | Controls: A, D / arrows and SPACE | Points: " + Math.round(-game.player.highestY / (3 * game.options.tileHeight)), game.canvas.width - 50, game.canvas.height - 12
}


game.requestRedraw = function () {
	if (!game.drawPending && !game.isOver) {
		game.drawPending = true
		requestAnimationFrame(game.redraw)
	}

	if(game.isOver) {
		clearInterval(this.player.fallInterval)
		game.context.font = "30px superscript"
		game.context.textAlign = "center"
		game.context.fillStyle = "black"
		game.context.fillText("Game over!", game.canvas.width / 2, game.canvas.height / 2)
		game.context.font = "15px Georgia"
		game.context.fillText("Score: "+score, game.canvas.width / 2, game.canvas.height / 2-30)
		game.context.font = "15px Georgia"
		game.context.fillText("(Refresh the page to restart)", game.canvas.width / 2, game.canvas.height / 2 +50 )
	}
}
