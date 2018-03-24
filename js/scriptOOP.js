class Pong {
	constructor(canvas){
		this._canvas = canvas;
		this._context = canvas.getContext('2d');

		this.x = this._canvas.width/2;
		this.y = this._canvas.height-30;
		this.dx = 2;
		this.dy = -2;
		this.ballRadius = 10;
		this.paddleHeight = 10;
		this.paddleWidth = 75;
		this.paddleX = (this._canvas.width - this.paddleWidth) / 2;
		this.paddleY = this._canvas.height - this.paddleHeight;
		this.rightPressed = false;
		this.leftPressed = false;
		this.brickRowCount = 3;
		this.brickColumnCount = 5;
		this.brickWidth = 75;
		this.brickHeight = 20;
		this.brickPadding = 10;
		this.brickOffsetTop = 30;
		this.brickOffsetLeft = 30;
		this.score = 0;
		this.lives = 3;

		this.bricks = [];
		for(let c=0; c<this.brickColumnCount; c++) {
		    this.bricks[c] = [];
		    for(let r=0; r<this.brickRowCount; r++) {
		        this.bricks[c][r] = { x: 0, y: 0, status : 1 };
		    }
		}

		this.draw = () => {
			this._context.clearRect(0,0,this._canvas.width, this._canvas.height);
			this.drawBricks();
			this.drawBall();
			this.drawPaddle();
			this.drawScore();
			this.drawLives();
			this.collisionDetection();

			 if(this.x + this.dx > this._canvas.width-this.ballRadius || this.x + this.dx < this.ballRadius) {
			        this.dx = -this.dx;
			    }
			    if(this.y + this.dy < this.ballRadius) {
			        this.dy = -this.dy;
			    }
			    else if(this.y + this.dy > this._canvas.height-this.ballRadius) {
			        if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
			            this.dy = -this.dy;
			        }
			        else {
			        	this.lives--;
			            if(!this.lives) {
			                console.log(("GAME OVER"));
			                document.location.reload();
			            } else{
			            	this.x = this._canvas.width/2;
			                this.y = this._canvas.height-30;
			                this.dx = 3;
			                this.dy = -3;
			                this.paddleX = (canvas.width-this.paddleWidth)/2;
			            }
			        }
			    }
			    
			    if(this.rightPressed && this.paddleX < this._canvas.width-this.paddleWidth) {
			        this.paddleX += 7;
			    }
			    else if(this.leftPressed && this.paddleX > 0) {
			        this.paddleX -= 7;
			    }

				this.x += this.dx;
				this.y += this.dy;

				requestAnimationFrame(this.draw);
		};
	}

	drawLives() {
		let ctx = this._context;
	    ctx.font = "16px Arial";
	    ctx.fillStyle = "#0095DD";
	    ctx.fillText("Lives: "+this.lives, this._canvas.width-65, 20);
	}

	drawScore() {
		let ctx = this._context;
	    ctx.font = "16px Arial";
	    ctx.fillStyle = "#0095DD";
	    ctx.fillText("Score: "+this.score, 8, 20);
	}

	drawBall(){
		this._context.beginPath();
		this._context.arc(this.x, this.y, 10, 0, Math.PI*2);
		this._context.fillStyle = 'red';
		this._context.fill();
		this._context.closePath();
	}

	drawPaddle(){
		let ctx = this._context;
		ctx.beginPath();
		ctx.rect(this.paddleX, this._canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
		this._context.fillStyle = 'blue';
		ctx.fill();
		ctx.closePath();
	}

	drawBricks() {
		let ctx = this._context;
	    for(let c=0; c<this.brickColumnCount; c++) {
	        for(let r=0; r<this.brickRowCount; r++) {
	        	if(this.bricks[c][r].status == 1){
		            let brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
		            let brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
		            this.bricks[c][r].x = brickX;
		            this.bricks[c][r].y = brickY;
		            ctx.beginPath();
		            ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
		            ctx.fillStyle = "#0095DD";
		            ctx.fill();
		            ctx.closePath();	        		
	        	}
	        }
	    }
	}

	keyDownHandler(e) {
	    if(e.keyCode == 39) {
	        this.rightPressed = true;
	    }
	    else if(e.keyCode == 37) {
	        this.leftPressed = true;
	    }
	}
	keyUpHandler(e) {
	    if(e.keyCode == 39) {
	        this.rightPressed = false;
	    }
	    else if(e.keyCode == 37) {
	        this.leftPressed = false;
	    }
	}

	mouseMoveHandler(e) {
	    var relativeX = e.clientX - this._canvas.offsetLeft + this._canvas.width / 2;
	    if(relativeX > 0 && relativeX < this._canvas.width) {
	        this.paddleX = relativeX - this.paddleWidth/2;
	    }
	}

	collisionDetection() {
	    for(let c=0; c<this.brickColumnCount; c++) {
	        for(let r=0; r<this.brickRowCount; r++) {
	            var b = this.bricks[c][r];
	            if(b.status == 1) {
	                if(this.x + this.ballRadius > b.x && this.x - this.ballRadius < b.x+this.brickWidth && this.y + this.ballRadius > b.y && this.y - this.ballRadius < b.y+this.brickHeight) {
	                    this.dy = -this.dy;
	                    b.status = 0;
	                    this.score++;
	                    
	                    if(this.score == this.brickRowCount*this.brickColumnCount) {
	                        console.log("YOU WIN, CONGRATULATIONS!");
	                        document.location.reload();
                    	}
	                }
	            }
	        }
	    }
	}

	start(){
		requestAnimationFrame(this.draw);
	}
}

let canvas = document.getElementById('myCanvas');
let pong = new Pong(canvas);

document.addEventListener("keydown", (e) => pong.keyDownHandler(e), false);
document.addEventListener("keyup", (e) => pong.keyUpHandler(e), false);
document.addEventListener("mousemove", (e) => pong.mouseMoveHandler(e), false);

pong.start();