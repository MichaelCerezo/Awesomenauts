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

	},

	update: function (delta){
		// sets the player entity to move
		if(me.input.isKeyPressed("right")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}else if(me.input.isKeyPressed("left")){
			// adds to the position of my x by the velocity defined above in
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movementlook smooth
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}else{
			this.body.vel.x = 0;
		}

		this.body.update(delta);
		return true;
	}
});