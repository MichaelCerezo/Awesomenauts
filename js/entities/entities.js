// Sets Player Properties
game.PlayerEntity = me.Entity.extend({
	// Sets up constructer functions and parameters
	init: function (x, y, settings){
		this.setSuper(x, y);
		this.setAttributes();
		this.setPlayerTimers();
		this.type = "PlayerEntity";
		this.setFlags();
		
		
		// Sets camera to follow character
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.addAnimation();

		// Sets animation that the player starts with
		this.renderable.setCurrentAnimation("idle");
	},

	// Changed the init functions to there own functions 
	setSuper: function(x, y){
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
	},

	setPlayerTimers: function(){
		// returns the numeric value corresponding to the time for the specified date according to universal time. 
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();
	},

	setAttributes: function(){
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		// Keeps track of which direction your player is going
		this.attack = game.data.playerAttack;
	},

	setFlags: function(){
		this.facing = "right"; 
		this.dead = false;
		this.attacking = false;
	},

	addAnimation: function(){		
		// Sets animation to the player
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
	},

	update: function (delta){
		this.now = new Date().getTime();
		// Handles the checkIfDead function
		this.dead = this.checkIfDead();
		this.checkKeyPressedAndMoved();
		this.setAnimation();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);
		this._super(me.Entity, "update", [delta])
		return true;
	},

	checkIfDead: function(){
		if(this.health <= 0){
		 	return true;
		 	// me.audio.play("Dying");
		}
		return false;
	},

	checkKeyPressedAndMoved: function(){
		// sets the player entity to move
		if(me.input.isKeyPressed("right")){
			this.moveRight();
		}else if(me.input.isKeyPressed("left")){
			this.moveLeft();
		}else if (me.input.isKeyPressed('jump')) {   
    		this.jump();
  		}else{
			this.body.vel.x = 0;
		}

		this.attacking = me.input.isKeyPressed("attack");
	},

	moveRight: function(){
		// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			// Makes player walk right
			this.flipX(true);
	},

	moveLeft: function(){
		// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.facing = "left";
			// Makes player walk left
			this.flipX(false);
	},

	jump: function(){
		if (!this.body.jumping && !this.body.falling) {
      			// set current vel to the maximum defined value
      			// gravity will then do the rest
      			this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
      			// set the jumping flag
      			this.body.jumping = true;
      			// me.audio.play("Boing");
    		}
    	},

    setAnimation: function(){
    	if (this.attacking) {
			if(!this.renderable.isCurrentAnimation("attack")){
				// Sets the current animation to attack and once that is over
				// goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				// Makes it so that the next time we start this sequencewe begin
				// from the first animation, not wherever we left off when we
				// switched off to another animation
				this.renderable.setAnimationFrame();
				// me.audio.play("Stab");
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
    },

	loseHealth: function(damage){
		this.health = this.health - damage; 
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
			this.collideWithEnemyBase(response);
		}else if(response.b.type==="EnemyCreep"){
			this.collideWithEnemyCreep(response);
		}
	},

	collideWithEnemyBase: function(response){
		var ydif = this.pos.y - response.b.pos.y;
		var xdif = this.pos.x - response.b.pos.x;

		// lets the player land on the base
		if(ydif<-40 && xdif< 55 && xdif>-25){
			this.body.falling = false;
			this.body.vel.y = -1;
		}else if(xdif>-35 && this.facing==='right' && (xdif<0)){
			this.body.vel.x = 0;
			// this.pos.x = this.pos.x - 1;
		}else if(xdif<70 && this.facing==='left' && (xdif>0)){
			this.body.vel.x = 0;
			// this.pos.x = this.pos.x + 1;
		}

		// Checks if player is attacking
		if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
			this.lastHit = this.now;
			// Sets enemy base to lose health
			response.b.loseHealth(game.data.playerAttack);
		}
	},

	collideWithEnemyCreep: function(response){
		var xdif = this.pos.x - response.b.pos.x;
		var ydif = this.pos.y - response.b.pos.y;

		this.stopMovement(xdif);
		if(this.checkAttack(xdif, ydif)){
			this.hitCreep(response);
		};
	},

	stopMovement: function(xdif){
		if(xdif>0){
			if(this.facing==="left"){
				this.body.vel.x = 0;
				}
			}else{
				if(this.facing==="right"){
					this.body.vel.x = 0;
				}
			}
	},

	checkAttack: function(xdif, ydif){
		if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
			// doesnt let player attack creep from top bottom or behind
			&&  (Math.abs(ydif) <= 40) &&
			(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
			){
			this.lastHit = this.now;
			// if the creeps health is less than our attack, execute code in if statement
			return true;
		}
		return false;
	},

	hitCreep: function(response){
		if(response.b.health <= game.data.playerAttack) {
				// adds one gold per creep kill
				game.data.gold += 1;
				console.log("Current gold: " + game.data.gold);
			}

			response.b.loseHealth(game.data.playerAttack); 
	}
});