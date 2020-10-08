const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
	worldSize: { x: 10, y: 10 },
	startPosition: { x: 1, y: 1 },
	scale: 50,
	lineWidth: 0.1,
	radius: 0.4,
	holeColor: "red",
	wallColor: "black",
	goalColor: "green",
};

const balls = {};

const walls = [
	{ position: { x: 0, y: 0 }, direction: { x: 1, y: 0 }, length: options.worldSize.x },
	{ position: { x: 0, y: 0 }, direction: { x: 0, y: 1 }, length: options.worldSize.y },
	{ position: { x: options.worldSize.x, y: 0 }, direction: { x: 0, y: 1 }, length: options.worldSize.y },
	{ position: { x: 0, y: options.worldSize.y }, direction: { x: 1, y: 0 }, length: options.worldSize.x },
	{ position: { x: 2, y: 0 }, direction: { x: 0, y: 1 }, length: 3 },
	{ position: { x: 2, y: 3 }, direction: { x: 1, y: 0 }, length: 3 },
	{ position: { x: 5, y: 3 }, direction: { x: 0, y: -1 }, length: 3 },
	{ position: { x: 0, y: 5 }, direction: { x: 1, y: 0 }, length: 7 },
	{ position: { x: 7, y: 5 }, direction: { x: 0, y: -1 }, length: 3 },
	{ position: { x: 7, y: 2 }, direction: { x: 1, y: 0 }, length: 1 },
	{ position: { x: 8, y: 2 }, direction: { x: 0, y: 1 }, length: 6 },
	{ position: { x: 8, y: 8 }, direction: { x: -1, y: 0 }, length: 2 },
	{ position: { x: 6, y: 8 }, direction: { x: 0, y: -1 }, length: 2 },
	{ position: { x: 6, y: 6 }, direction: { x: -1, y: 0 }, length: 5 },
	{ position: { x: 1, y: 6 }, direction: { x: 0, y: 1 }, length: 2 },
	{ position: { x: 1, y: 8 }, direction: { x: -1, y: 0 }, length: 2 },
	{ position: { x: 3, y: 10 }, direction: { x: 0, y: -1 }, length: 2 },
	{ position: { x: 3, y: 8 }, direction: { x: 1, y: 0 }, length: 1 },
	{ position: { x: 4, y: 8 }, direction: { x: 0, y: 1 }, length: 2 },
];

const holes = [
	{ x: 0.5, y: 4.5 },
	{ x: 4, y: 3.5 },
	{ x: 9.5, y: 0.5 },
	{ x: 8.5, y: 5.5 },
	{ x: 4.5, y: 9.5 },
	{ x: 1.5, y: 7 },
];

const goal = {
	position: { x: 0, y: 8 },
	size: { x: 2, y: 2 },
};

let last = Date.now();
let paused = false;
const update = () => {
	const delta = Date.now() - last;
	last = Date.now();
	if (paused)
		return;

	for (let peer of Object.keys(balls)) {
		const ball = balls[peer];

		// Wall collisions
		for (let wall of walls) {
			if (wallDist(wall, ball.position) < options.radius) {
				const d = ball.velocity;
				const n = Vec.normalize(Vec.rotate(wall.direction, 0.5 * Math.PI));
				ball.velocity = Vec.subtract(d, Vec.scale(n, 2 * Vec.dot(d, n)));
				ball.position = Vec.add(ball.position, Vec.scale(ball.velocity, 0.0001));
			}
		}

		// Check for lose
		for (let hole of holes) {
			if (Vec.distance(hole, ball.position) < options.radius) {
				console.log("lose");
				ball.position = options.startPosition;
			}
		}

		// Check for win
		if (ball.position.x > goal.position.x &&
			ball.position.x < goal.position.x + goal.size.x &&
			ball.position.y > goal.position.y &&
			ball.position.y < goal.position.y + goal.size.y) {
			console.log("win");
		}

		// Update ball physics
		ball.velocity = Vec.add(ball.velocity, Vec.scale(ball.input, delta / 1000));
		ball.velocity = Vec.scale(ball.velocity, 0.98);
		ball.position = Vec.add(ball.position, Vec.scale(ball.velocity, delta / 1000));
	}
};

const wallDist = (wall, point) => {
	const v = Vec.subtract(point, wall.position);
	const d = Math.min(wall.length, Math.max(0, Vec.dot(v, wall.direction)));
	return Vec.distance(Vec.add(wall.position, Vec.scale(wall.direction, d)), point);
};

const draw = () => {
	update();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	ctx.scale(options.scale, options.scale);

	// Draw holes
	for (let hole of holes) {
		ctx.beginPath();
		ctx.arc(hole.x, hole.y, options.radius, 0, 2 * Math.PI);
		ctx.fillStyle = options.holeColor;
		ctx.fill();
	}

	// Draw goal
	ctx.fillStyle = options.goalColor;
	ctx.fillRect(goal.position.x, goal.position.y, goal.size.x, goal.size.y);

	// Draw balls
	for (let peer of Object.keys(balls)) {
		const ball = balls[peer];

		// Circle
		ctx.beginPath();
		ctx.arc(ball.position.x, ball.position.y, options.radius, 0, 2 * Math.PI);
		ctx.fillStyle = ball.color;
		ctx.fill();

		// Velocity debug
		const goal = Vec.add(ball.position, ball.velocity);
		ctx.beginPath();
		ctx.moveTo(ball.position.x, ball.position.y);
		ctx.lineWidth = 0.1;
		ctx.lineCap = "round";
		ctx.lineTo(goal.x, goal.y);
		ctx.stroke();
	}

	// Draw walls
	ctx.lineCap = "round";
	ctx.lineWidth = options.lineWidth;
	ctx.strokeStyle = options.wallColor;
	for (let wall of walls) {
		ctx.beginPath();
		ctx.moveTo(wall.position.x, wall.position.y);
		const end = Vec.add(wall.position, Vec.scale(wall.direction, wall.length));
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}

	ctx.restore();
	requestAnimationFrame(draw);
};

window.addEventListener("focus", () => paused = false);
window.addEventListener("blur", () => paused = true);

canvas.width = options.worldSize.x * options.scale;
canvas.height = options.worldSize.y * options.scale;
draw();

const ws = new WebSocket("ws://localhost:1338");
ws.onmessage = msg => {
	const data = JSON.parse(msg.data);

	for (let peer of Object.keys(data)) {
		const vector = data[peer];
		if (balls[peer]) {
			// Update existing peer
			balls[peer].input = { x: vector[0], y: vector[1] * -1 };
		} else {
			// Add new peer
			balls[peer] = {
				position: options.startPosition,
				velocity: { x: 0, y: 0 },
				input: { x: 0, y: 0 },
				color: `hsl(${Math.round(Math.random() * 360)}deg, 80%, 50%)`
			};
		}
	}

	// Remove old peers
	for (let peer of Object.keys(balls)) {
		if (!data[peer]) {
			delete balls[peer];
		}
	}
};
ws.onopen = () => setInterval(() => ws.send("get"), 100);