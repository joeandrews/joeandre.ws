
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
class foodSpot {
	constructor(options) {

		this.width = options.width;
		this.height = options.height;

		this.foodLevel = 15;
		this.foodMatrix =  [];

		for (let i= 0; i< this.width; i++) {
				this.foodMatrix[i] = [];
		
				for (let j= 0; j< this.height; j++) {
					this.foodMatrix[i][j] = 0;
				}
		}
		for (let i=0; i< 15; i++)	 {

			let x  = rand(25, this.width-25);
			let y  = rand(25, this.height-25);
				for(let j= x; j< x +7; j++) {
						
					for(let k= y; k< y +7; k++) {
							this.foodMatrix[j][k]	 = 2;
					}
				}
		}

		for(let j= options.hillLocation[0]; j< options.hillLocation[0] +50; j++) {
				
			for(let k= options.hillLocation[1]; k< options.hillLocation[1] +50; k++) {
					this.foodMatrix[j][k]	 = -1;
			}
		}
	}

	generateRandomPositions () {
		
		let x  = Math.random() * (this.width -25 - 25) + 25;
		let y  = Math.random() * (this.height -25 - 25) + 25;

		return [x,y];
	}

}

module.exports = foodSpot;
