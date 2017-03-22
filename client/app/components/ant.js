function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;

}
class Ant {
	constructor(options) {
		// options.anthill is the start position

		this.options = options.options;
		this.pheromoneMap = options.pheromoneMap;
		this.index = options.index;

		let directions = [
			[0, 1], //n
			[1, 1], // ne
			[1, 0], // e
			[1, -1], // se
			[0, -1], // s
			[-1, -1], // sw
			[-1, 0], // w
			[-1, 1], // nw
		];

		this.directions = directions;
		this.direction = directions[Math.floor(Math.random() * (7 - 0 + 1)) + 0];
		this.counter = 0;
		this.directionInt = 0;
		this.width = options.width;
		this.height = options.height;

		if (options.hillLocation) {

			let x = randInt(25, this.width - 25);
			let y = randInt(25, this.height - 25);
			// this.position = [x,y] ;
			this.position = options.hillLocation;
		} else {
			this.position = [0, 0];
		}
		this.foodMatrix = options.foodMatrix;


	}

	draw(context) {
		if (this.hasFood) {
			if (this.foodImage) {

				context.save();
				context.translate(this.position[0] + 10, this.position[1] + 10);
				this.angle = this.directionInt * 45;
				context.rotate(-this.angle * Math.PI / 180);
				this.angleChange = false;
				context.drawImage(this.foodImage, -10, -10, 20, 20);
				context.restore();
			} else {

				this.foodImage = new Image();
				this.foodImage.width = 20;
				this.foodImage.height = 20;
				this.foodImage.onload = () => {
						context.save();
						context.translate(this.position[0] + 10, this.position[1] + 10);
						// this.angle = this.directionInt * 45;
						// context.rotate(this.angle * Math.PI / 180);
						context.drawImage(this.foodImage, -10, -10, 20, 20);
						context.restore();
					}
					// host and invert this
				this.foodImage.src = 'https://s3.amazonaws.com/fuuzik/ant-red.png';

			}

		} else {

			if (this.image) {

				context.save();
				context.translate(this.position[0] + 10, this.position[1] + 10);
				this.angle = this.directionInt * 45;
				context.rotate(-this.angle * Math.PI / 180);
				this.angleChange = false;
				context.drawImage(this.image, -10, -10, 20, 20);
				context.restore();
			} else {

				this.image = new Image();
				this.image.width = 20;
				this.image.height = 20;
				this.image.onload = () => {
						context.save();
						context.translate(this.position[0] + 10, this.position[1] + 10);
						// this.angle = this.directionInt * 45;
						// context.rotate(this.angle * Math.PI / 180);
						context.drawImage(this.image, -10, -10, 20, 20);
						context.restore();
					}
					// host and invert this
				this.image.src = 'https://s3.amazonaws.com/fuuzik/ant-grey.png';

			}
		}
	}

	getPosition() {
		return this.position;
	}

	getDirection() {
		return this.direction;
	}

	nextPosition() {
		// the grid
		// ants can move n,s,e,w from current position

		// [-1, 0] west
		// [1, 0] east
		// [0, 1] north
		// [0, -1] south
		this.counter = Math.random();

		if (this.counter > 0.9) {

			this.angleChange = true;

			this.counter = 0;
			let left = this.directionInt - 1;
			let right = this.directionInt + 1;
			if (left < 0) {
				left = 7;
			}
			if (right > 7) {
				right = 0;
			}
			let directions = [
				this.directions[left],
				this.directions[this.directionInt],
				this.directions[right],
			];

			directions = shuffle(directions);

			let probability = [];
			let probSum = 0;

			// we find the pheromone for each
			let largest;
			let maxProb = 0;
			for (let i = 0; i < directions.length; i++) {

				let x1 = this.position[0] + directions[i][0];
				let y1 = this.position[1] + directions[i][1];

				let x2 = this.position[0] + this.direction[0];
				let y2 = this.position[1] + this.direction[1];

				if (x1 <= this.width - 1 && x1 >= 1 && y1 <= this.height - 1 && y1 >= 1) {

					let pheromone = this.pheromoneMap.matrix[x1] ? this.pheromoneMap.matrix[x1][y1] : 0;
					pheromone = pheromone;
					let localFactor = Math.random();
					if (pheromone < 0.00000000000000001) {
						pheromone = 0.00001;
					}

					// let localProb = pheromone;
					let localProb = Math.pow(localFactor, 0 - this.options.beta) * Math.pow(pheromone, this.options.alpha);

					probability[i] = localProb;
					probSum = probSum + localProb;
					if (localProb > maxProb) {
						maxProb = localProb;
						largest = i;
					}

				} else {
					probability[i] = 0;
				}

			}
			let nextThreshold = probSum * Math.random();
			let nextStop = largest;
			// pick the next direction
			for (let j = 1; j < directions.length; j++) {

				nextThreshold = nextThreshold - probability[j];
				if (nextThreshold > 0) {
					nextStop = j;
				}
			}
			if (directions[nextStop]) {

				this.direction = directions[nextStop];
			}

			// ne = 1
			if (this.direction[0] === 1) {
				if (this.direction[1] === 0) {
					// e = 2
					this.directionInt = 2;

				}
				if (this.direction[1] === 1) {
					//ne = 1
					this.directionInt = 1;
				}

				if (this.direction[1] === -1) {

					//se = 3
					this.directionInt = 3;

				}

			}

			if (this.direction[0] === -1) {

				if (this.direction[1] === 0) {
					// w = 6
					this.directionInt = 6;

				}
				if (this.direction[1] === 1) {
					//nw= 7
					this.directionInt = 7;
				}

				if (this.direction[1] === -1) {

					//sw = 5
					this.directionInt = 5;

				}
			}

			if (this.direction[0] === 0) {

				if (this.direction[1] === 1) {
					//n= 0
					this.directionInt = 0;
				}

				if (this.direction[1] === -1) {

					//s = 4
					this.directionInt = 4;

				}
			}
		}

		// we only do this if the ant has food
		if (this.position[0] <= this.width - 1 && this.position[0] >= 1 && this.position[1] <= this.height - 1 && this.position[1] >= 1) {

			this.position[0] = this.position[0] + this.direction[0];
			this.position[1] = this.position[1] + this.direction[1];


			if (this.position[0] <= this.width - 1 && this.position[0] >= 1 && this.position[1] <= this.height - 1 && this.position[1] >= 1) {
				if (this.foodMatrix.foodMatrix[this.position[0]][this.position[1]] > 0 && !this.hasFood) {
					this.hasFood = true;
					this.foodMatrix.foodMatrix[this.position[0]][this.position[1]]--;
					this.direction[0] = -this.direction[0];
					this.direction[1] = -this.direction[1];
				} else if (this.foodMatrix.foodMatrix[this.position[0]][this.position[1]] < 0) {
					// at home
					if (this.hasFood) {

						this.foodMatrix.foodMatrix[this.position[0]][this.position[1]]--;
						this.hasFood = false;
						// reverse the direction
						this.direction[0] = -this.direction[0];
						this.direction[1] = -this.direction[1];

						console.log('Ant dropped food');

					}

				}

			} else {

				this.position[0] = this.position[0] - this.direction[0];
				this.position[1] = this.position[1] - this.direction[1];

				this.direction[0] = -this.direction[0];
				this.direction[1] = -this.direction[1];
			}

		} else {

			this.direction[0] = -this.direction[0];
			this.direction[1] = -this.direction[1];


		}

		if (this.direction[0] === 1) {
			if (this.direction[1] === 0) {
				// e = 2
				this.directionInt = 2;

			}
			if (this.direction[1] === 1) {
				//ne = 1
				this.directionInt = 1;
			}

			if (this.direction[1] === -1) {

				//se = 3
				this.directionInt = 3;

			}

		}

		if (this.direction[0] === -1) {

			if (this.direction[1] === 0) {
				// w = 6
				this.directionInt = 6;

			}
			if (this.direction[1] === 1) {
				//nw= 7
				this.directionInt = 7;
			}

			if (this.direction[1] === -1) {

				//sw = 5
				this.directionInt = 5;

			}
		}

		if (this.direction[0] === 0) {

			if (this.direction[1] === 1) {
				//n= 0
				this.directionInt = 0;
			}

			if (this.direction[1] === -1) {

				//s = 4
				this.directionInt = 4;

			}
		}
		return this.position;

	}
}

module.exports = Ant
