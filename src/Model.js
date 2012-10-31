/*global _:true, balze:true */
(function () {
    "use strict";

	blaze.Model = function(setup) {
		this.getGridSize = _.constant(setup.gridSize);
	};

	blaze.Model.prototype.restart = function() {
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