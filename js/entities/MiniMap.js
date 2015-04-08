game.MiniMap = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "minimap",
			width: 631,
			height: 158,
			spritewidth: "631",
			spriteheight: "158",
			getShape: function(){
				// lowered the base to 60
				return(new me.Rect(0, 0, 631, 158)).toPolygon();
			}
		}]);
		this.floating = true;
	},
});
