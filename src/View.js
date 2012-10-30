/*global _:true, blaze:true, $:true */

blaze.View = function(model) {
	this.model = model;
	this.canvas = $("#canvas");

	//resize canvas to correct height
	var canvas_wrap = $("#canvas_wrap");
	var height = canvas_wrap.innerHeight() - 20;
	this.canvas[0].width = height;
	this.canvas[0].height = height;
	canvas_wrap.height(height);

	this.ctx = this.canvas[0].getContext("2d");

	var width = this.canvas.width();

	this.ctx.scale(width, height);

	this.pixel = 1 / width;

	this.canvas.click(_.bind(this._mouseClick, this));
	this.canvas.mousemove(_.bind(this._mouseMove, this));
	this.canvas.mouseleave(_.bind(this._mouseLeave, this));
};

blaze.View.prototype._mouseClick = function(event) {
};
blaze.View.prototype._mouseMove = function(event) {
};
blaze.View.prototype._mouseLeave = function(event) {
};

blaze.View.prototype.update = function() {
};