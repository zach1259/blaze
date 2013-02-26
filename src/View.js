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

		blaze.click = 0;
		this.invert = [false, true];
		this.invertButton();

		//this.treeSprite = document.getElementById("treeSprite");
		this.treeSprite = new Image();
		this.treeSprite.src = "sprites/tree_cut.png";
		this.treeSpriteLoaded = false;
		var _this = this;
		this.treeSprite.onload = function() {
			_this.treeSpriteLoaded = true;
		};
		this.fireSprite = new Image();
		this.fireSprite.src = "sprites/fire_cut.png";
		this.fireSpriteLoaded = false;
		var _this = this;
		this.fireSprite.onload = function() {
			_this.fireSpriteLoaded = true;
		};
		this.ashes = new Image();
		this.ashes.src = "sprites/ashes.png";
		this.ashesLoaded = false;
		var _this = this;
		this.ashes.onload = function() {
			_this.ashesLoaded = true;
		};

		this.size = this.model.getGridSize();
	};

	blaze.View.prototype.drawForrest = function() {
		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				this.drawBrown(x, y);
			
				this.drawColors(x, y);
				this.ctx.fillRect(x / this.size, y / this.size, 1 / this.size, 1 / this.size);

				if (this.model.forrest[x][y].isGreen()) {
					this.ctx.drawImage(this.treeSprite, x / this.size, y / this.size, 1 / this.size, 1 / this.size);
				}
				if (this.model.forrest[x][y].isRed()) {
					this.ctx.drawImage(this.fireSprite, x / this.size, y / this.size, 1 / this.size, 1 / this.size);
				}
				if (this.model.forrest[x][y].isBurnt()) {
					this.ctx.drawImage(this.ashes, x / this.size, y / this.size, 1 / this.size, 1 / this.size);
				}
			}
		}
	};

	blaze.View.prototype.drawBrown = function(x, y) {
		this.ctx.fillStyle = "#855e42";
		if (this.invert[blaze.click % 2]) {
			this.ctx.fillStyle = "#8aa1bd";
		}
	};

	blaze.View.prototype.drawColors = function(x, y) {
		var forrest = this.model.forrest;
		/*if (forrest[x][y].isGreen()) {
			this.ctx.fillStyle = "#00ff00";
			if (this.invert[blaze.click % 2]) {
				this.ctx.fillStyle = "#ff00ff";
			}
		} else*/ if (forrest[x][y].color === 2) {
			this.ctx.fillStyle = "#0000ff";
			if (this.invert[blaze.click % 2]) {
				this.ctx.fillStyle = "#ffff00";
			}
		} /*else if (forrest[x][y].color === 3) {
			this.ctx.fillStyle = "#ff0000";
			if (this.invert[blaze.click % 2]) {
				this.ctx.fillStyle = "#00ffff";
			}
		} else if (forrest[x][y].color === 4) {
			this.ctx.fillStyle = "#909090";
			if (this.invert[blaze.click % 2]) {
				this.ctx.fillStyle = "#7f7f7f";
			}
		}*/
	};

	blaze.View.prototype._mouseClick = function(event) {
		var pixelX = event.pageX - this.canvas.offset().left;
		var pixelY = event.pageY - this.canvas.offset().top;
	
		var x = Math.floor(pixelX / (this.canvas.width() / this.model.getGridSize()));
		var y = Math.floor(pixelY / (this.canvas.height() / this.model.getGridSize()));

		if (this.model.water > 1) {
			this.model.waterFill(x, y);
			this.model.forrest[x][y].color = 2;
			this.model.water -= 100 / this.model.getWater();
			this.update();
		}
	};

	blaze.View.prototype._mouseMove = function(event) {
	};
	blaze.View.prototype._mouseLeave = function(event) {
	};

	blaze.View.prototype.invertButton = function() {
		$('#invert').click(function() {
			blaze.click++
		});
	};

	blaze.View.prototype.update = function() {
		if (!this.treeSpriteLoaded && !this.fireSpriteLoaded && !this.ashesLoaded) {
			window.setTimeout(_.bind(this.update, this), 100);
			return;
		}
		$("#water .value").text(Math.floor(this.model.water));
		$("#burned .value").text(this.model.burned);
		$("#tries .value").text(this.model.tries);
		this.drawForrest();
	};

}());