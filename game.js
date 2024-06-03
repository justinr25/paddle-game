// canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// variables
const PADDLE_SPEED = .1

let mouse = {
    x: undefined,
    y: undefined,
}

let pointOnPaddle = {
    x: undefined,
    y: undefined
}

let score = 0

// event listeners
addEventListener('mousemove', (event) => {
    mouse = {
        x: event.clientX,
        y: event.clientY
    }
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// utility functions
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(min, max, value) {
    if (value < min) {
        return min
    } else if (value > max) {
        return max
    } else {
        return value
    }
}

// objects
function Ball(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color

    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = 'black'
        c.fillStyle = this.color
        c.stroke()
        c.fill()
    }

    this.update = function() {
        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
            this.dx = -this.dx
        }
        if (this.y + this.radius + this.dy > canvas.height || this.y - this.radius + this.dy < 0) {
            this.dy = -this.dy
        } else {
            // this.dy += GRAVITY
        }

        this.x += this.dx
        this.y += this.dy

        this.draw()
    }
}

function Paddle(x, y, width, height, radius, dx, color) {
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.radius = radius
    this.radius
    this.dx = dx
    this.color = color

    this.draw = function () {
        c.fillStyle = this.color
        c.strokeStyle = 'black'
        c.beginPath()
        c.roundRect(this.x, this.y, this.width, this.height, this.radius)
        c.fill()
        c.stroke()
    }

    this.update = function () {
        // move paddle according to x position of mouse
        if (mouse.x < this.x + this.width / 2) {
            // decrement velocity
            this.dx -= PADDLE_SPEED
        }
        if (mouse.x > this.x + this.width / 2) {
            // increment velocity
            this.dx += PADDLE_SPEED
        }

        // stop paddle from skating past mouse
        if (this.dx > 0 && mouse.x <= this.x + this.width / 2 || this.dx < 0 && mouse.x >= this.x + this.width / 2) {
            this.dx = 0
        }

        // stop paddle from going out of bounds
        if (this.x < 0) {
            this.x = 0
            this.dx = 0
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width
            this.dx = 0
        }

        // update x position of paddle
        this.x += this.dx

        this.draw()
    }
}

// implementation
let ball
let paddle
let endScore

function init() {
    const ball_radius = 20
    const ball_x = innerWidth / 2
    const ball_y = innerHeight / 2
    const ball_dx = 0
    const ball_dy = 5
    const ball_color = 'red'

    const paddle_width = 140
    const paddle_height = 20
    const paddle_x = innerWidth / 2 - paddle_width / 2
    const paddle_y = canvas.height * 0.875
    const paddle_radius = 5
    const paddle_dx = 0
    const paddle_color = 'green'

    ball = new Ball(ball_x, ball_y, ball_dx, ball_dy, ball_radius, ball_color)
    paddle = new Paddle(paddle_x, paddle_y, paddle_width, paddle_height, paddle_radius, paddle_dx, paddle_color)
}

function displayScore() {
    c.font = "50px Verdana"
    c.fillStyle = "#000"
    c.textAlign = "center"
    c.fillText("Score: " + score, innerWidth / 2, 50)
}

function gameOver() {
    c.clearRect(0, 0, canvas.width, canvas.height)

    score = endScore
    displayScore()

    c.font = "100px Arial"
    c.fillStyle = "#000"
    const textString = "GAME OVER", textWidth = c.measureText(textString).width
    c.textAlign = "center"
    c.fillText(textString, innerWidth / 2, innerHeight / 2)
    
    ball.y = 99999
    ball.x = 99999
    ball.dx = 0
    ball.dy = 0
    paddle.y = 99999
    paddle.dx = 0
}

// animation loop
function animate() {
    requestAnimationFrame(animate)

    c.clearRect(0, 0, innerWidth, innerHeight)

    // update ball and paddle
    ball.update()
    paddle.update()

    // update score
    displayScore()

    // handle collision
    pointOnPaddle.x = clamp(paddle.x, paddle.x + paddle.width, ball.x)
    pointOnPaddle.y = clamp(paddle.y, paddle.y + paddle.height, ball.y)
    if (distance(ball.x, ball.y, pointOnPaddle.x, pointOnPaddle.y) <= ball.radius) {
        score += 10
        ball.dy = randomIntFromRange(-10, -7)
        ball.dx = randomIntFromRange(-8, 8)
    }

    // handle game over
    if (ball.y + ball.radius + ball.dy >= canvas.height) {
        endScore = score
        gameOver()
        // return
    }

    // console.log(pointOnPaddle)
    // console.log(paddle, ball)
}

init()
animate()

// addEventListener('keydown', (event) => {
//     switch (event.key) {
//         case "ArrowLeft":
//             paddle.dx -= PADDLE_SPEED
//             if (paddle.dx > 0) {
//                 paddle.dx = 0
//             }
//             break
//         case "ArrowRight":
//             paddle.dx += PADDLE_SPEED
//             if (paddle.dx < 0) {
//                 paddle.dx = 0
//             }
//             break
//     }
// })