/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0,
		enemyBaseHealth: 10,
		playerBaseHealth: 10,
		enemyCreepHealth: 10,
		playerHealth: 5,
		enemyCreepAttack: 1,
		playerAttack: 1,
		playerAttackTimer: 300,
		enemyCreepAttackTimer: 300,
		playerMoveSpeed: 10,
		creepMoveSpeed: 5,
		gameTimeManager: "",
		heroDeathManager: "",
		player: "",
		exp: 0,
		gold: 0,
		skill1: "",
		skill2: "",
		skill3: "",
		ability1: "",
		ability2: "",
		ability3: "",
		exp1: 0,
		exp2: 0,
		exp3: 0,
		exp4: 0,
		win: "",
		pausePos: "",
		buyscreen: "",
		buytext: ""
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	// Changes screen height and width
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, '1.0')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	me.save.add({exp: 0, exp1: 0, exp2: 0, exp3: 0, exp4: 0});

	me.state.SPENDEXP = 112;

	// Initialize the audio.
	me.audio.init("mp3,ogg");
	

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		// Registers the player function that can make multiple instances of the player
		me.pool.register("player", game.PlayerEntity, true);
		me.pool.register("PlayerBase", game.PlayerBaseEntity);
		me.pool.register("PlayerCreep", game.PlayerCreep, true);
		me.pool.register("EnemyBase", game.EnemyBaseEntity);
		me.pool.register("EnemyCreep", game.EnemyCreep, true);
		me.pool.register("GameTimerManager", game.GameTimerManager);
		me.pool.register("HeroDeathManager", game.HeroDeathManager);
		me.pool.register("ExperienceManager", game.ExperienceManager);
		me.pool.register("SpendGold", game.SpendGold);

		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(me.state.SPENDEXP, new game.SpendExp());

		// Start the game.
		me.state.change(me.state.MENU);
	}
};
