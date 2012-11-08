/*global _:true, blaze:true, $:true */
(function () {
    "use strict";

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

		this.water = 100;
	};

	blaze.View.prototype.drawForrest = function() {
		this.size = this.model.getGridSize();
		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				this.drawColors(x, y);
				this.ctx.fillRect(x / this.size, y / this.size, 1 / this.size, 1 / this.size);
			}
		}
	};

	blaze.View.prototype.drawColors = function(x, y) {
		var forrest = this.model.forrest;
		if (forrest[x][y] <= this.model.getPrecentGreen()) {
			this.ctx.fillStyle = "#855e42";
		} else if (forrest[x][y] === 2) {
			this.ctx.fillStyle = "#0000ff";
		} else if (forrest[x][y] === 3) {
			this.ctx.fillStyle = "#ff0000";
		}else {
			this.ctx.fillStyle = "#00ff00";
		}
	};

	blaze.View.prototype._mouseClick = function(event) {
		var pixelX = event.pageX;
		var pixelY = event.pageY;
	
		var x = Math.floor((pixelX / (462 / this.model.getGridSize())) - 1);
		var y = Math.floor((pixelY / (462 / this.model.getGridSize())) - 1);

		if (this.water > 0) {
			this.model.forrest[x][y] = 2;
			this.water -= 100 / this.model.getWater()
			this.update();
		}
	};
	blaze.View.prototype._mouseMove = function(event) {
	};
	blaze.View.prototype._mouseLeave = function(event) {
	};

	blaze.View.prototype.update = function() {
		$("#water .value").text(Math.floor(this.water));
		this.drawForrest();
	};

}());