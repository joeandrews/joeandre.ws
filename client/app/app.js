// import Common from './common/common';
// import Components from './components/components';
// import AppComponent from './app.component';
import 'normalize.css';
import './app.scss';
import Ant from './components/ant';
import FoodSpot from './components/foodSpot';
import PheromoneMap from './components/pheromoneMap';

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function factors_naive(n) {
	return chain(range(1, n), function(x) { // monadic chain/bind
		return n % x ? [] : [x]; // monadic fail or inject/return
	});
}

function chain(xs, f) {
	return [].concat.apply([], xs.map(f));
}

// [m..n]
function range(m, n) {
	return Array.apply(null, Array(n - m + 1)).map(function(x, i) {
		return m + i;
	});
}
var init = () => {
	'use strict';
	var canvas = document.getElementById('world');
	canvas.width = (window.innerWidth -50);
	canvas.height = (window.innerHeight * 0.5);

	// var pherCanvas = document.getElementById('pher');
	// pherCanvas.width = window.innerWidth - 50;
	// pherCanvas.height = window.innerHeight * 0.4;
	if (canvas && canvas.getContext) {
		let context = canvas.getContext('2d');

		// initialise the world variables
		let noAnts = Math.floor(canvas.width / 8);
		let noFoodSpots = 10;
		let foodSize = 10;
		let RHO = 0.1;
		let BETA = 8.5;
		let ALPHA = 0.9;

		var PheromoneMapSystem = new PheromoneMap({
			width: canvas.width,
			height: canvas.height
		});

		let foodMatrix = new FoodSpot({
			width: canvas.width ,
			height: 400,
			hillLocation: [ canvas.width -200,  canvas.height-108],
		});
		var ants = [];
		var foodSpots = [];
		for (var i = 0; i < noAnts; i++) {
			ants.push(new Ant({
				hillLocation: [ canvas.width -200,  canvas.height-108],
				pheromoneMap: PheromoneMapSystem,
				foodMatrix: foodMatrix,
				index: i,
				width: canvas.width ,
				height: canvas.height ,
				options: {
					beta: BETA,
					width: canvas.width ,
					height: canvas.height ,
					alpha: ALPHA
				}
			}));
			// ants.push(i);
		}

		var m_canvas = document.createElement('canvas');
		m_canvas.width = canvas.width;
		m_canvas.height = canvas.height;
		var mcontext = m_canvas.getContext('2d');

		mcontext.clearRect(0, 0, canvas.width, canvas.height);

		mcontext.globalAlpha = 1;
		mcontext.fillStyle = 'rgba(255,255,255,0)';
		mcontext.fillRect(0,0,canvas.width, canvas.height);
		mcontext.fill();
		function updatePher(canvas, context) {

			var imageData = context.getImageData(0,0, canvas.width, canvas.height);
			var pher = Math.random() * 0.001;
			for (var j = canvas.width; j--;)  {
				for (var k = canvas.height; k--;)  {

					// if (foodMatrix.foodMatrix[j][k] < 0) {

						// context.fillStyle = '#04A777';
						// context.globalAlpha = 1;
						// context.fillRect(j,k,1,1);
						// context.fill();

						// continue;
					// }

					// if (foodMatrix.foodMatrix[j][k] > 0) {

						// context.fillStyle = '#CE1483';
						// context.globalAlpha = 1;
						// context.fillRect(j,k,1,1);
						// context.fill();
						// continue;
					// }
					let x = PheromoneMapSystem.matrix[j][k]= PheromoneMapSystem.matrix[j][k] - PheromoneMapSystem.matrix[j][k] * pher;
					let node = (k * canvas.width + j) * 4;

					if (x > 0.0001) {
					imageData.data[node] = 68;
					// imageData.data[node+1] =64;
					// imageData.data[node+2] = 64;

					imageData.data[node+1] =61;
					imageData.data[node+2] = 61;
					imageData.data[node+3] = x*255;
					}
					else {

					}

						// if (x < 0.001) {
							// x = 0;
						// }
						// context.fillStyle = '#000';
						// context.globalAlpha = 1;
						// context.fillRect(j,k,1,1);

						// context.fillStyle = '#fff';
						// context.globalAlpha = x;
						// context.fillRect(j,k,1,1);
						continue;

					// }


					// console.log(x);

				}


			}

			// context.fill();
			// context.putImageData(imageData, 0, 0);
			return imageData;
		}
		// the world defines everything
		// everything runs in step
		let counter = 0;

		let step = () => {
			// window.requestAnimationFrame(function () {

				context.globalAlpha = 1;
				// context.clearRect(0, 0, canvas.width, canvas.height);
				// context.fillStyle = 'rgba(0,0,0,1)';
				// context.fillRect(0,0,canvas.width, canvas.height);

// i			context.fill();
				function render() {

					let c = updatePher(m_canvas, mcontext);
					// var image = c.getImageData(0,0, canvas.width, canvas.height);

					context.globalAlpha = 1;

					context.putImageData(c, 0,0);
					step();

					// document.body.style.backgroundImage = "url(" + c.toDataURL("image/png") + ")";
				}
				// copy into visual canvas at different position
				// context.putImageData(image, 0, 0);
				// context.globalAlpha = 1;
				for (let i = 0; i < ants.length; i++) {
					let nextPosition = ants[i].nextPosition();
					ants[i].draw(context);
				}

				for (let i = 0; i < ants.length; i++) {
				let nextPosition = ants[i].position;
				let deposit = Math.random();	
				if (ants[i].hasFood && nextPosition[0] > 1 && nextPosition[0] < canvas.width -1 && nextPosition[1] > 1 && nextPosition[1] < canvas.height -1) {
				PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]]  + 1;
					// PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]-1]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]]  + deposit;
				// PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]+1]  + deposit;
				}
				else if (nextPosition[0] > 1 && nextPosition[0] < canvas.width -1 && nextPosition[1] > 1 && nextPosition[1] < canvas.height -1) {

					PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]]  + 1;

				// // PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1]  + 0.1;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]-1]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]]  + .1;
				// // PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]+1]  + .1;
				}
				// // if (i === 10) {

				// // }
				// // else {

				// // PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]]  + 0.2;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]+1]  + 0.2
				// // PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]-1]  + 0.2;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]-1]  + 0.2;
				// // PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]+1][nextPosition[1]]  + 0.2;
				// // PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]] = PheromoneMapSystem.matrix[nextPosition[0]-1][nextPosition[1]]  + 0.2;
				// // PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1] = PheromoneMapSystem.matrix[nextPosition[0]][nextPosition[1]+1]  + 0.2;
				// // }

				}
				// context.globalAlpha = 1;
				// calculate updates to the world
				// for each ant
				// find next position
				// if ant is at food
				// returns to ant hill based on home pheromones
				// if ant is at ant hill
				//drop food and go out again
				// else
				// move randomly influeneced by pheromones
				// update in the context
				// decay all old pheromones
				// update the pheromone trails map
				// decide if we add more food
				// render

				// PheromoneMapSystem.decayAllPher();
				// if (counter > 50)	 {
				// counter = 0;

				// updatePher(pherCanvas);
				// }
				window.requestAnimationFrame(render);
				counter++;

			// });
			// step

		}
		window.onload = function () {
			step();
		};
	}
	return this;
};

init() === window;
