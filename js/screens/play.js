game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		// lets the game know what map to load
		me.levelDirector.loadLevel("level01");

		// Adds player
		var player = me.pool.pull("player", 0, 0, {});
		me.game.world.addChild(player, 5);

		// binds keys with movement
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.LEFT, "left");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game worlds
		me.game.world.removeChild(this.HUD);
	}
});
