// TODO: rewrite to TS;

class Ball {
  #TAU = Math.PI * 2;

  constructor(id, x, y, radius, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    let initialVector = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    let vectorX =
      initialVector.x /
      Math.sqrt(
        initialVector.x * initialVector.x + initialVector.y * initialVector.y,
      );
    let vectorY =
      initialVector.y /
      Math.sqrt(
        initialVector.x * initialVector.x + initialVector.y * initialVector.y,
      );
    this.vector = { x: vectorX, y: vectorY };
  }

  draw(cx) {
    cx.beginPath();
    cx.arc(this.x, this.y, this.radius, 0, this.#TAU);
    cx.fillStyle = `rgba(213, 42, 209, 1)`;
    cx.fill();
  }

  step(boundX, boundY) {
    this.x += this.vector.x * this.speed;
    this.y += this.vector.y * this.speed;
    this.checkBounds(boundX, boundY);
  }

  checkBounds(boundX, boundY) {
    if (this.x - this.radius <= 0) {
      this.vector.x *= -1;
    }
    if (this.x + this.radius >= boundX) {
      this.vector.x *= -1;
    }
    if (this.y - this.radius <= 0) {
      this.vector.y *= -1;
    }
    if (this.y + this.radius >= boundY) {
      this.vector.y *= -1;
    }
  }
}

export class BallsCanvas {
  constructor() {
    this.canvasContainer = document.querySelector(".canvas-section");
    this.canvas = this.canvasContainer.querySelector("canvas");
    this.cx = this.canvas.getContext("2d");
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.balls = [];
    this.ballsAmount = null;
    this.separationThreshold = 180;
    this.rafId = null;
    this.radiusMultiplier = null;
  }

  #createBall = (ballId, radiusMultiplier) => {
    const posX = Math.random() * (this.canvasWidth / 2) + this.canvasWidth / 4;
    const posY =
      Math.random() * (this.canvasHeight / 2) + this.canvasHeight / 4;
    const radius = Math.random() * radiusMultiplier + 5;
    const speed = Math.random() + 1;
    return new Ball(ballId, posX, posY, radius, speed);
  };

  #doLinks = (srcBall) => {
    for (let i = 0; i < this.balls.length; i++) {
      if (i === srcBall.id) {
        continue;
      }

      const ball = this.balls[i];
      const separation = this.#getBallsDistance(srcBall, ball);

      if (separation < this.separationThreshold) {
        const width = 1;
        let opacity = 0.7;

        if (separation > this.separationThreshold / 2) {
          opacity = Math.abs(separation / this.separationThreshold - 1);
        }

        this.cx.beginPath();
        this.cx.moveTo(srcBall.x, srcBall.y);
        this.cx.lineTo(ball.x, ball.y);
        this.cx.lineWidth = width;
        this.cx.strokeStyle = `rgba(213, 42, 209, ${opacity})`;
        this.cx.stroke();
      }
    }
  };

  #getBallsDistance = (ball1, ball2) => {
    const xDiff = ball1.x - ball2.x;
    const yDiff = ball1.y - ball2.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  #setCanvasDimensions = () => {
    this.canvasWidth = this.canvas.width = this.canvasContainer.offsetWidth;
    this.canvasHeight = this.canvas.height = this.canvasContainer.offsetHeight;
  };

  destroy = () => {
    window.cancelAnimationFrame(this.rafId);
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.balls = [];
  };

  init = (config) => {
    this.rafId = window.requestAnimationFrame(this.init);
    this.cx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.#setCanvasDimensions();
    this.cx.globalCompositeOperation = "lighter";
    this.ballsAmount = config.amount;
    this.radiusMultiplier = config.radiusMultiplier;

    for (let i = 0; i < this.ballsAmount; i++) {
      this.balls.push(this.#createBall(i, this.radiusMultiplier));
    }

    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      ball.draw(this.cx);
      ball.step(this.canvasWidth, this.canvasHeight);
      this.#doLinks(ball);
    }
  };

  reRender = (config) => {
    this.destroy();
    this.init(config);
  };
}
