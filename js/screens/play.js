game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		console.log(game.data.exp);
		console.log(game.data.exp2);

		// lets the game know what map to load
		me.levelDirector.loadLevel("level01");

		this.resetPlayer(0, 500);
		
		// Manages game timers
		var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
		me.game.world.addChild(gameTimerManager, 0);

		var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
		me.game.world.addChild(heroDeathManager, 0);

		var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
		me.game.world.addChild(experienceManager, 0);

		var spendGold = me.pool.pull("SpendGold", 0, 0, {});
		me.game.world.addChild(spendGold, 0);

		// binds keys with movement
		me.input.bindKey(me.input.KEY.B, "buy");
		me.input.bindKey(me.input.KEY.Q, "skill1");
		me.input.bindKey(me.input.KEY.W, "skill2");
		me.input.bindKey(me.input.KEY.E, "skill3");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.UP, "jump");
		me.input.bindKey(me.input.KEY.SPACE, "attack");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		// me.audio.playTrack("battle");
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game worlds
		me.game.world.removeChild(this.HUD);
	},

	resetPlayer: function(x, y){
		// Adds player
		game.data.player = me.pool.pull("player", x, y, {});
		me.game.world.addChild(game.data.player, 5);
	} 

});
