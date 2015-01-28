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

		this.body.setVelocity(5, 20);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		// Sets animation to the player
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);

		// Sets animation that the player starts with
		this.renderable.setCurrentAnimation("idle");
	},

	update: function (delta){
		// sets the player entity to move
		if(me.input.isKeyPressed("right")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			// Makes player walk right
			this.flipX(true);
		}else if(me.input.isKeyPressed("left")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.flipX(false);
		}else{
			this.body.vel.x = 0;
		}

		// Sets animation when needed
		if(this.body.vel.x !==0){
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}else{
			this.renderable.setCurrentAnimation("idle");	
		}



		this.body.update(delta);

		this._super(me.Entity, "update", [delta])
		return true;
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
				return(new me.Rect(0, 0, 100, 100)).toPolygon()
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
				return(new me.Rect(0, 0, 100, 100)).toPolygon()
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






