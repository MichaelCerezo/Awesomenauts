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
			game.data.win = false;
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
