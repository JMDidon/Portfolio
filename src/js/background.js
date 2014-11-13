(function () {
	'use strict';

	/**
	 *	Initialize background animation
	 */
	window.BackgroundAnimation = window.BackgroundAnimation || {};
	BackgroundAnimation.init = function() {
		console.info('BackgroundAnimation.init()');

		// Set a maximum number of dots in the screen. 5000 is arbitrary (for a Full HD screen, there will be ~400 dots)
		var number = (window.innerWidth * window.innerHeight) / 5000;
		BackgroundAnimation.config = {
			number : number,
			distance : 70,
			dots : [],
			speed: 20
		};

		BackgroundAnimation.setup.setCanvas();
		BackgroundAnimation.setup.createDots();
		BackgroundAnimation.play();
	};

	/**
	 *	Launch animation
	 */
	BackgroundAnimation.play = function() {
		if ( !BackgroundAnimation.core.isRunning ) {
			BackgroundAnimation.core.then = window.performance.now();
			BackgroundAnimation.core.frame();
			BackgroundAnimation.core.isRunning = true;
		}
	};

	/**
	 *	Stop animation
	 */
	BackgroundAnimation.stop = function() {
		console.info('Stop animation');
		window.cancelAnimationFrame(BackgroundAnimation.core.animationFrame);
		BackgroundAnimation.core.isRunning = false;
	};

	/**
	 *	Core internals for the animation
	 */
	BackgroundAnimation.core = {
		/**
		 *	Set the informations for each frame
		 */
		frame: function() {
			BackgroundAnimation.core.setDelta();
			BackgroundAnimation.core.update();
			BackgroundAnimation.core.render();
			BackgroundAnimation.core.animationFrame = window.requestAnimationFrame(BackgroundAnimation.core.frame);
		},

		/**
		 *	The delta is the time elapsed between each frame
		 */
		setDelta: function() {
			BackgroundAnimation.core.now = window.performance.now();
			BackgroundAnimation.core.delta = (BackgroundAnimation.core.now - BackgroundAnimation.core.then) / 1000;
			BackgroundAnimation.core.then = BackgroundAnimation.core.now;
		},

		/**
		 *	Calculations to perform for each frame
		 */
		update: function() {
			//BackgroundAnimation.workers.linkDots();
			BackgroundAnimation.workers.moveDots();
		},

		/**
		 *	Re-draw canvas based on the calculations
		 */
		render: function() {
			BackgroundAnimation.workers.clearCanvas();
			BackgroundAnimation.workers.renderGraphics();
		}
	};

	/**
	 *	Sets the canvas and the dots
	 */
	BackgroundAnimation.setup = {
		/**
		 *	Canvas configuration
		 */
		setCanvas: function() {
			BackgroundAnimation.canvas = document.querySelector('#canvas');
			BackgroundAnimation.canvas.width = window.innerWidth;
			BackgroundAnimation.canvas.height = window.innerHeight;
			BackgroundAnimation.canvas.ctx = BackgroundAnimation.canvas.getContext('2d');
			BackgroundAnimation.canvas.ctx.fillStyle = '#2AA1DD';
			BackgroundAnimation.canvas.ctx.lineWidth = 0.1;
			BackgroundAnimation.canvas.ctx.strokeStyle = '#2AA1DD';
			BackgroundAnimation.canvas.ctx.imageSmoothingEnabled = true;
		},

		/**
		 *	Create dots via a constructor function and store them in the global object
		 *	Each dot is instanciated with a random x and y position. Their radius and x/y velocity is also random.
		 *	The velocity is corresponds to a random positive or negative number multiplicated by a given speed.
		 */
		createDots: function() {
			function Dot() {
				this.x = 0.1 + Math.random() * canvas.width;
				this.y = 0.1 + Math.random() * canvas.height;

				this.vx = Math.random() * (Math.random() < 0.5 ? -1 : 1) * BackgroundAnimation.config.speed;
				this.vy = Math.random() * (Math.random() < 0.5 ? -1 : 1) * BackgroundAnimation.config.speed;

				this.radius = Math.random() * 3;
			}

			for (var i = 0; i < BackgroundAnimation.config.number; i++) {
				var dot = new Dot();
				BackgroundAnimation.config.dots.push(dot);
			}
		}
	};

	/**
	 *	Functions rendering the animation
	 */
	BackgroundAnimation.workers = {
		/**
		 *	Clear canvas
		 */
		clearCanvas: function() {
			BackgroundAnimation.canvas.ctx.clearRect(0, 0, BackgroundAnimation.canvas.width, BackgroundAnimation.canvas.height);
		},

		/**
		 *	Each dot will be moved based on its velocity
		 */
		moveDots: function() {
			for (var i = 0; i < BackgroundAnimation.config.number; i++) {
				var velocityX = BackgroundAnimation.config.dots[i].vx * BackgroundAnimation.core.delta;
				BackgroundAnimation.config.dots[i].x = BackgroundAnimation.config.dots[i].x + velocityX;

				var velocityY = BackgroundAnimation.config.dots[i].vy * BackgroundAnimation.core.delta;
				BackgroundAnimation.config.dots[i].y = BackgroundAnimation.config.dots[i].y + velocityY;

				// Dots will reappear at the other side of the screen
				if (BackgroundAnimation.config.dots[i].x > BackgroundAnimation.canvas.width) {
					BackgroundAnimation.config.dots[i].x = 0;
				}
				else if (BackgroundAnimation.config.dots[i].x < 0) {
					BackgroundAnimation.config.dots[i].x = BackgroundAnimation.canvas.width;
				}


				if (BackgroundAnimation.config.dots[i].y > BackgroundAnimation.canvas.height) {
					BackgroundAnimation.config.dots[i].y = 0;
				}
				else if (BackgroundAnimation.config.dots[i].y < 0) {
					BackgroundAnimation.config.dots[i].y = BackgroundAnimation.canvas.height;
				}
			}
		},

		/**
		 *	Draw a line between dots when they are near enough
		 * 	@param 	 {Object} 	thisDot: Dot object, the dot that is tested against all others
		 */
		linkDots: function(thisDot) {
			for(var i = 0; i < BackgroundAnimation.config.number; i++) {
				var secondDot = BackgroundAnimation.config.dots[i];

				if(		(thisDot.x - secondDot.x) < BackgroundAnimation.config.distance
					&&	(thisDot.y - secondDot.y) < BackgroundAnimation.config.distance
					&&	(thisDot.x - secondDot.x) > -BackgroundAnimation.config.distance
					&&	(thisDot.y - secondDot.y) > -BackgroundAnimation.config.distance
				) {
					BackgroundAnimation.canvas.ctx.beginPath();
					BackgroundAnimation.canvas.ctx.moveTo(thisDot.x, thisDot.y);
					BackgroundAnimation.canvas.ctx.lineTo(secondDot.x, secondDot.y);
					BackgroundAnimation.canvas.ctx.stroke();
					BackgroundAnimation.canvas.ctx.closePath();
				}
			}
		},

		/**
		 *	Draw the dots and launch the function to draw the lines
		 */
		renderGraphics: function() {
			for (var i = 0; i < BackgroundAnimation.config.number; i++) {
				BackgroundAnimation.canvas.ctx.beginPath();
				BackgroundAnimation.canvas.ctx.arc(BackgroundAnimation.config.dots[i].x, BackgroundAnimation.config.dots[i].y, BackgroundAnimation.config.dots[i].radius, 0, Math.PI * 2, false);
				BackgroundAnimation.canvas.ctx.fill();

				BackgroundAnimation.workers.linkDots(BackgroundAnimation.config.dots[i]);
			}
		}

	};

	BackgroundAnimation.init();

	/**
	 *	Start/Stop the animation "on demand"
	 */
	window.addEventListener('keyup', function (e) {
		if (e.which === 32) {
			BackgroundAnimation.init();
		}
		else if (e.which === 27) {
			BackgroundAnimation.stop();
		}
	});

	/**
	 *	Redraw on resize
	 */
	window.addEventListener('resize', function (e) {
		BackgroundAnimation.config.dots = [];
		BackgroundAnimation.workers.clearCanvas();
		BackgroundAnimation.setup.setCanvas();
		BackgroundAnimation.setup.createDots();
		BackgroundAnimation.workers.renderGraphics();
	});

})();
