	/*global _:true, blaze:true */
	(function () {
	    "use strict";

		blaze.Model = function(setup) {
			this.getGridSize = _.constant(setup.gridSize);
			this.getPrecentGreen = _.constant(setup.precentGreen);
			this.getWater = _.constant(setup.waterTankSize);
			this.getBurnRate = _.constant(setup.burnRate);
			this.getFlamability = _.constant(setup.flamability);
			this.getFloodFillNeighbors = _.constant(setup.floodFillNeighbors);

			this.water = 100;
			this.burned = 0;
			this.tries = 0;
		};

		blaze.Model.prototype.restart = function() {
			this.forrest = [];
			for (var x = 0; x < this.getGridSize(); x++) {
				this.forrest[x] = [];
				for (var y = 0; y < this.getGridSize(); y++) {
					this.forrest[x][y] = new blaze.Square(x, y, this);
					this.forrest[x][y].stepsTillBurned = 1 / this.getBurnRate();

					if (this.forrest[0][y].color <= this.getPrecentGreen()) {
						this.forrest[0][y].color = 3;
					}
				}
			}
			this.water = 100;
			this.tries = 1;
		};

		blaze.Model.prototype.reset = function() {
			for (var x = 0; x < this.getGridSize(); x++) {
				for (var y = 0; y < this.getGridSize(); y++) {
					if (this.forrest[x][y].color > 1) {
						this.forrest[x][y].color = .2;
					}
				}
			}
			this.tries++;
		};

		blaze.Model.prototype.waterFill = function(x, y) {
			if (this.forrest[x][y].isBlue()) {
				var visited = [];
				visited.push(this.forrest[x][y]);
				for (var xx = x - 1; xx <= x + 1; xx++) {
					for (var yy = y - 1; yy <= y + 1; yy++) {
						this.walk(this.forrest[xx][yy], visited);
					}
				}
			}
			_.chain(visited)
				.shuffle()
				.filter(function(Square) {
					return Square.isGreen;
				})
				.first(this.getFloodFillNeighbors())
				.each(function(Square) {
					Square.color = 2;
				});
		};

		blaze.Model.prototype.walk = function(target, visited) {
			var x = target.getX();
			var y = target.getY();

			if (_.contains(visited, target) || target.isBrown()) {
				return;
			} else if (x < 50 && y < 50 && x >= 0 && y >= 0) {
				visited.push(target);
				if (target.isBlue()) {
					for (var xx = x - 1; xx <= x + 1; xx++) {
						for (var yy = y - 1; yy <= y + 1; yy++) {
							this.walk(this.forrest[xx][yy], visited);
						}
					}
				}
			}
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

		blaze.Model.prototype.burn = function(x, y) {
			for (var xx = x - 1; xx <= x + 1; xx++) {
				for (var yy = y - 1; yy <= y + 1; yy++) {
					if (xx < 50 && yy < 50 && xx >= 0 && yy >= 0) {
						if (this.forrest[xx][yy].isGreen()) {
							this.forrest[xx][yy].color = 3;
						}
					}
				}
			}
		};

		blaze.Model.prototype.step = function() {
			var totalBurned = 0;
			this.isBurning();
			for (var x = 0; x < this.getGridSize(); x++) {
				for (var y = 0; y < this.getGridSize(); y++) {
					if (this.forrest[x][y].color === 3) {
						if (Math.random() <= this.getFlamability()) {
							this.burn(x, y);
						}
						if (this.forrest[x][y].stepsTillBurned === 0) {
							this.forrest[x][y].color = 4;
						} else {
							this.forrest[x][y].stepsTillBurned--;
						}
					}
					if (this.forrest[x][y].isBurnt()) {
						totalBurned++;
					}	
				}
			}
			this.burned = Math.floor((totalBurned / (this.getGridSize() * this.getGridSize())) * 200);
		};

		blaze.Square = function(x, y, model) {
			this.getX = _.constant(x);
			this.getY = _.constant(y);
			this.color = Math.random();
			this.stepsTillBurned = 100;
			this.isBlue = function() {
				return this.color === 2;
			}
			this.isBrown = function() {
				return this.color > model.getPrecentGreen() && this.color <= 1;
			}
			this.isGreen = function() {
				return this.color < model.getPrecentGreen();
			}
			this.isRed = function() {
				return this.color === 3;
			}
			this.isBurnt = function() {
				return this.color === 4;
			}
		};

	}());