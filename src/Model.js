/*global _:true, blaze:true */
(function () {
    "use strict";

	blaze.Model = function(setup) {
		this.getGridSize = _.constant(setup.gridSize);
		this.getPrecentGreen = _.constant(setup.precentGreen);
		this.getWater = _.constant(setup.waterTankSize);
		this.getBurnRate = _.constant(setup.burnRate);
		this.getFlamability = _.constant(setup.flamability);

		this.water = 100;
		this.burned = 0;
	};

	blaze.Model.prototype.restart = function() {
		this.forrest = [];
		for (var x = 0; x < this.getGridSize(); x++) {
			this.forrest[x] = [];
			for (var y = 0; y < this.getGridSize(); y++) {
				this.forrest[x][y] = new blaze.Square(x, y);
				this.forrest[x][y].stepsTillBurned = 1 / this.getBurnRate();

				if (this.forrest[0][y].color <= this.getPrecentGreen()) {
					this.forrest[0][y].color = 3;
				}
			}
		}
		this.water = 100;
	};

	blaze.Model.prototype.isBurning = function() {
		for (var x = 0; x < this.getGridSize(); x++) {
			for (var y = 0; y < this.getGridSize(); y++) {
				if (this.forrest[x][y].color === 3) {
					return true;
				}
			}
		}
		return false;
	};

	blaze.Model.prototype.startFire = function() {
		for (var y = 0; y < this.getGridSize(); y++) {
			this.burn(0, y);
		}
	};

	blaze.Model.prototype.precentBurned = function(x, y){
		var totalBurned = 0;
		if (this.forrest[x][y].color === 4) {
			totalBurned++;
		}
		this.burned = Math.floor(totalBurned / (this.getGridSize() * this.getGridSize()));
	};

	blaze.Model.prototype.burn = function(x, y) {
		for (var xx = x - 1; xx <= x + 1; xx++) {
			for (var yy = y - 1; yy <= y + 1; yy++) {
				if (xx < 50 && yy < 50 && xx >= 0 && yy >= 0) {
					if (this.forrest[xx][yy].color <= this.getPrecentGreen()) {
						this.forrest[xx][yy].color = 3;
					}
				}
			}
		}
	};

	blaze.Model.prototype.step = function() {
		this.isBurning();
		for (var x = 0; x < this.getGridSize(); x++) {
			for (var y = 0; y < this.getGridSize(); y++) {
				if (this.forrest[x][y].color === 3) {
					if (Math.random() <= this.getFlamability()) {
						this.burn(x, y);
					}
					if (this.forrest[x][y].stepsTillBurned === 0) {
						this.forrest[x][y].color = 4;
						this.precentBurned(x, y);
					} else {
						this.forrest[x][y].stepsTillBurned--;
					}
				}	
			}
		}
	};

	blaze.Square = function(x, y) {
		this.getX = _.constant(x);
		this.getY = _.constant(y);
		this.color = Math.random();
		this.stepsTillBurned = 100;
	};

}());