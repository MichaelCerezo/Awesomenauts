// Handles all the timers
game.GameTimerManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		// Keeps track of the last time a creep was made
		this.lastCreep = new Date().getTime();
		this.paused = false;
		// Makes sure the game is always updating
		this.alwaysUpdate = true;
	},

	update: function(){
		// Keeps track of timer
		this.now = new Date().getTime();
		this.goldTimerCheck();
		this.creepTimerCheck();

		return true;
	},

	goldTimerCheck: function(){
		if(Math.round(this.now/1000) %20 ===0 && (this.now - this.lastCreep >= 1000)){
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}
	},

	creepTimerCheck: function(){
		if(Math.round(this.now/1000) %10 ===0 && (this.now - this.lastCreep >= 1000)){
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 2350, 500, {});
			me.game.world.addChild(creepe, 5);
			var creepe2 = me.pool.pull("PlayerCreep", 200, 450, {});
			me.game.world.addChild(creepe2, 5);
		}
	}
});

game.HeroDeathManager = Object.extend({
	init: function(x, y, settings){
		// Makes sure the game is always updating
		this.alwaysUpdate = true;
	},

	update: function(){
		if (game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			me.state.current().resetPlayer(10, 0);
		}
		return true;
	}
});

game.ExperienceManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
		this.gameOver = false;
	},

	update: function(){
		if(game.data.win === true && !this.gameOver){
			this.gameOver(true);
		}else if(game.data.win === false && !this.gameOver){
			this.gameOver(true);
		}

		return true;
	},

	gameOver: function(win){
		if (win) {
			game.data.exp += 10;
		}else{
			game.data.exp += 1;
		}
		
		this.gameOver = true;
		me.save.exp = game.data.exp;
	}
});