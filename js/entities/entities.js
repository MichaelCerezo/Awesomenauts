// Sets Player Properties
game.PlayerEntity = me.Entity.extend({
	// Sets up constructer functions and parameters
	init: function (x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image:	"player",
			// Tells the program how much space to preserve
			width: 64,
			height: 64,
			// Tells the program how much space is being used
			spritewidth: "64",
			spriteheight: "64",
			getShape: function (){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		this.body.setVelocity(10, 20);
		// Keeps track of which direction your player is going
		this.facing = "right"; 
		// returns the numeric value corresponding to the time for the specified date according to universal time. 
		this.new = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();
		// Sets camera to follow character
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		// Sets animation to the player
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		// Sets animation that the player starts with
		this.renderable.setCurrentAnimation("idle");
	},

	update: function (delta){
		this.now = new Date().getTime();
		// sets the player entity to move
		if(me.input.isKeyPressed("right")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			// Makes player walk right
			this.flipX(true);
		}else if(me.input.isKeyPressed("left")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.facing = "left";
			// Makes player walk left
			this.flipX(false);
		}else if (me.input.isKeyPressed('jump')) {   
    		if (!this.body.jumping && !this.body.falling) {
      			// set current vel to the maximum defined value
      			// gravity will then do the rest
      			this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
      			// set the jumping flag
      			this.body.jumping = true;
    		}
  		}else{
			this.body.vel.x = 0;
		}

		if (me.input.isKeyPressed("attack")) {
			if(!this.renderable.isCurrentAnimation("attack")){
				console.log(!this.renderable.isCurrentAnimation("attack"));
				// Sets the current animation to attack and once that is over
				// goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				// Makes it so that the next time we start this sequencewe begin
				// from the first animation, not wherever we left off when we
				// switched off to another animation
				this.renderable.setAnimationFrame();
			}
		}
		// Sets animation when needed
		else if(this.body.vel.x !==0 && !this.renderable.isCurrentAnimation("attack")){
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");	
		}

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);

		this._super(me.Entity, "update", [delta])
		return true;
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			// lets the player land on the base
			if(ydif<-40 && xdif< 55 && xdif>-25){
				this.body.falling = false;
				this.body.vel.y = -1;
			}else if(xdif>-35 && this.facing==='right' && (xdif<0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x - 1;
			}else if(xdif<70 && this.facing==='left' && (xdif>0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x + 1;
			}

			// Checks if player is attacking
			if(this.renderable.isCurrentAnimation('attack') && this.now-this.lastHit >= 1000){
				console.log("tower Hit");
				this.lastHit = this.now;
				// Sets enemy base to lose health
				response.b.loseHealth();
			}
		}
	}
});

// Sets PlayerBase Properties
game.PlayerBaseEntity = me.Entity.extend({
	init: function (x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return(new me.Rect(0, 0, 100, 60)).toPolygon()
			}
		}]);
		// Lets the program know the base still has life
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "PlayerBaseEntity";
	
		// Sets base to look fine
		this.renderable.addAnimation("idle", [0]);
		// Sets base to look destroyed
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");

	},

	// Updates the bases life to know when its broken
	update: function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.addAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function(){

	}
});

// Sets EnemyBase Properties
game.EnemyBaseEntity = me.Entity.extend({
	init: function (x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				// lowered the base to 60
				return(new me.Rect(0, 0, 100, 60)).toPolygon()
			}
		}]);
		// Lets the program know the base still has life
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";

		// Sets base to look fine
		this.renderable.addAnimation("idle", [0]);
		// Sets base to look destroyed
		this.renderable.addAnimation("broken", [1]);
		//renderable is a class in melon js that helps us in animating the character
		this.renderable.setCurrentAnimation("idle");
	},

	// Updates the bases life to know when its broken
	update: function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.addAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function(){

	},

	loseHealth: function(){
		this.health--;
	}
});

// Sets EnemyCreep Properties
game.EnemyCreep = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		this.health = 10;
		this.alwaysUpdate = true;

		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");

	},

	update: function(){

	}
});

// Handles all the timers
game.GameManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		// Keeps track of the last time a creep was made
		this.lastCreep = new Date().getTime();

		// Makes sure the game is always updating
		this.alwaysUpdate = true;
	},

	update: function(){
		// Keeps track of timer
		this.now = new Date().getTime();

		if(Math.round(this.now/1000) %10 ===0 && (this.now - this.lastCreep >= 1000)){
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
});