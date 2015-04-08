game.HeroDeathManager = Object.extend({
	init: function(x, y, settings){
		// Makes sure the game is always updating
		this.alwaysUpdate = true;
	},

	update: function(){
		if (game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			me.game.world.removeChild(game.data.miniPlayer);
			me.state.current().resetPlayer(10, 0);
		}
		return true;
	}
});
