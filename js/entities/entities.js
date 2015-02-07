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
		this.type = "PlayerEntity";
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		// Keeps track of which direction your player is going
		this.facing = "right"; 
		// returns the numeric value corresponding to the time for the specified date according to universal time. 
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.dead = false;
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
		// removes player when dead
		if(this.health <= 0){
			me.game.world.removeChild(this);
		}
		this.now = new Date().getTime();

		if(this.health <= 0){
			this.dead = true;
			this.pos.x = 10;
			this.pos.y = 0;
			this.health = game.data.playerHealth;
		}

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

	loseHealth: function(damage){
		this.health = this.health - damage; 
		console.log(this.health);
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
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
				console.log("tower Hit");
				this.lastHit = this.now;
				// Sets enemy base to lose health
				response.b.loseHealth(game.data.playerAttack);
			}
		}else if(response.b.type==="EnemyCreep"){
				var xdif = this.pos.x - response.b.pos.x;
				var ydif = this.pos.y - response.b.pos.y;

				if(xdif>0){
					this.pos.x = this.pos.x + 1;
					if(this.facing==="left"){
						this.body.vel.x = 0;
					}
				}else{
					this.pos.x = this.pos.x - 1;
					if(this.facing==="right"){
						this.body.vel.x = 0;
					}
				}
				if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
						// doesnt let player attack creep from top bottom or behind
						&&  (Math.abs(ydif) <= 40) &&
						(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
						){
					this.lastHit = this.now;
					response.b.loseHealth(game.data.playerAttack);
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
		this.health = game.data.playerBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "PlayerBase";
	
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
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},

	onCollision: function(){

	},
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
		this.health = game.data.enemyBaseHealth;
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
			this.renderable.setCurrentAnimation("broken");
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
		this.health = game.data.enemyCreepHealth;
		this.alwaysUpdate = true;
		// this.attacking lets us know if the enemy is currently attacking
		this.attacking = false;
		// keeps track of when our creep attacks anything
		this.lastAttacking = new Date().getTime();
		// keeps track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage){
		this.health = this.health - damage; 
	},

	update: function(delta){
		console.log(this.health);
		// removes creep when dead
		if(this.health <= 0){
			me.game.world.removeChild(this);
		}
		this.now = new Date().getTime();

		// Has the creep walk left
		this.body.vel.x -= this.body.accel.x * me.timer.tick;

		me.collision.check(this, true, this.collideHandler.bind(this), true);

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);

		return true;
	},

	collideHandler: function(response){
		if(response.b.type==='PlayerBase'){
			this.attacking=true;
			// this.lastAttacking=this.now;
			if(xdif>0){
				// keeps movingthe creep to the right to maintain position
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			// checks that it has has been at least one second since the creep has hit a base
			if((this.now-this.lastHit >= 300)){
				// updates the last hit timer
				this.lastHit = this.now;
				// makes the player base call its loseHealth functionand passes it a damage of 1
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}else if(response.b.type==='PlayerEntity'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			// this.lastAttacking=this.now;
			this.body.vel.x = 0;
			// keeps movingthe creep to the right to maintain position
			this.pos.x = this.pos.x + 1;
			// checks that it has has been at least one second since the creep has hits something
			if((this.now-this.lastHit >= 300) && xdif>0){
				// updates the last hit timer
				this.lastHit = this.now;
				// makes the player  call its loseHealth functionand passes it a damage of 1
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
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
			var creepe = me.pool.pull("EnemyCreep", 2350, 500, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
});