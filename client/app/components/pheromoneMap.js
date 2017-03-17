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
		// let nodes = options.width * options.height;

		// inner x
		//innerY
		// this.matrix[i] = []

		for (let j = 0; j < this.width + 1; j++) {

			// this.matrix[0][j] = 1/0.25;
			// this.matrix[1][j] = 1/0.25;
			// this.matrix[2][j] = 1/0.25;
			// this.matrix[3][j] = 1/0.25;
			// this.matrix[4][j] = 1/0.25;
			// this.matrix[5][j] = 1/0.25;
			// this.matrix[6][j] = 1/0.25;
			// this.matrix[7][j] = 1/0.25;
			this.matrix[j] = [];
			for (let k = 0; k < this.height + 1; k++) {

				this.matrix[j][k] = 0;
				// for (let l = 0; l < options.width; l++) {

				// this.matrix[i][j][k][l] = 1 / 0.25;
				// }
			}

		}
		// goal is to do this.matrix[x][y][x][y]
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
				// console.log(this.matrix[i][j]);
			}
		}
	}

	getPheromone (x1,y1) {

		return this.matrix[x1][y1];
	}

}

module.exports = pheromoneMap;
