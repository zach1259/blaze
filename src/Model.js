/*global _:true, blaze:true */
(function () {
    "use strict";

	blaze.Model = function(setup) {
		this.getGridSize = _.constant(setup.gridSize);
		this.getPrecentGreen = _.constant(setup.precentGreen);
		this.getWater = _.constant(setup.waterTankSize);

		this.water = 100;
	};

	blaze.Model.prototype.restart = function() {
		this.forrest = [];
		for (var x = 0; x < this.getGridSize(); x++) {
			this.forrest[x] = [];
			for (var y = 0; y < this.getGridSize(); y++) {
				this.forrest[x][y] = Math.random();
			}
		}
		this.water = 100;
	};

	blaze.Model.prototype.isBurning = function() {
	};

	blaze.Model.prototype.step = function() {
	};

	blaze.Square = function(x, y) {
		this.getX = _.constant(x);
		this.getY = _.constant(y);
	};

}());