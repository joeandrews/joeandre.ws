class pheromoneMap {
	constructor (options) {

		// set up the matrix
		this.directions = {
			0: [ 0,1 ],
			1: [ 1,1 ],
			2: [ 1,0 ],
			3: [ 1,-1 ],
			4: [ 0, -1 ],
			5: [ -1, -1 ],
			6: [ -1, 0 ],
			7: [ -1,1 ]
		};
		this.matrix = [];
		this.width = options.width;
		this.height = options.height;

		for (let j = 0; j < this.width + 1; j++) {

			this.matrix[j] = [];
			for (let k = 0; k < this.height + 1; k++) {

				this.matrix[j][k] = 0;
			}

		}
	}

	updatePheromone (x, y, hasFood) {

		function rand(min, max) {
			return Math.random() * (max - min) + min;
		}
		if (x <= this.width-1 && y <= this.height-1) {
			if (hasFood) {

				this.matrix[x][y] = this.matrix[x][y] + 0.3
			}
			else {

				this.matrix[x][y] = this.matrix[x][y] + 0.3;
			}
			if (this.matrix[x][y] > 10) {
				this.matrix[x][y] = 9;
			}
		}
	}

	decayAllPher () {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {

				this.matrix[i][j] = this.matrix[i][j] - (this.matrix[i][j] * 0.2);
			}
		}
	}

	getPheromone (x1,y1) {

		return this.matrix[x1][y1];
	}

}

module.exports = pheromoneMap;
