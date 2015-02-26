//Intermediate work 
// Sets PlayerCreep Properties
game.PlayerCreep = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "creep2",
			width: 100,
			height: 85,
			spritewidth: "100",
			spriteheight: "85",
			getShape: function(){
				return(new me.Rect(0, 0, 100, 85)).toPolygon();
			}
		}]);
		this.health = game.data.playerHealth;
		this.alwaysUpdate = true;
		// this.attacking lets us know if the enemy is currently attacking
		this.attacking = false;
		// keeps track of when our creep attacks anything
		this.lastAttacking = new Date().getTime();
		// keeps track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "PlayerCreep";

		this.renderable.addAnimation("walk", [0, 1, 2, 3, 4,], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage){
		this.health = this.health - damage; 
	},

	update: function(delta){
		// removes creep when dead
		if(this.health <= 0){
			me.game.world.removeChild(this);
		}
		this.now = new Date().getTime();

		// Has the creep walk left
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.flipX(true);

		me.collision.check(this, true, this.collideHandler.bind(this), true);

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);

		return true;
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
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
				response.b.loseHealth(game.data.playerAttack);
			}
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
				response.b.loseHealth(game.data.playerAttack);
			}
		}else if(response.b.type==='EnemyCreep'){
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
				response.b.loseHealth(game.data.playerAttack);
			}
		}
	}
});


