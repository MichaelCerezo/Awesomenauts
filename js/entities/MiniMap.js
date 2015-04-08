game.MiniMap = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "minimap",
			width: 317,
			height: 80,
			spritewidth: "317",
			spriteheight: "80",
			getShape: function(){
				// lowered the base to 60
				return(new me.Rect(0, 0, 317, 80)).toPolygon();
			}
		}]);
		this.floating = true;
	},
});
