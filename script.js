const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
	worldSize: { x: 400, y: 400 },
	ballColor: "blue",
	holeColor: "brown",
	wallColor: "orange",
};

const ball = {
	position: Vec.scale(options.worldSize, 0.5),
	velocity: { x: -100, y: -121 },
	radius: 10,
};

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
	{ position: { x: 30, y: 90 }, radius: 20 },
	{ position: { x: 40, y: 260 }, radius: 20 },
	{ position: { x: 200, y: 30 }, radius: 20 },
	{ position: { x: 340, y: 210 }, radius: 20 },
	{ position: { x: 70, y: 160 }, radius: 20 },
];

let last = Date.now();
const update = () => {
	const delta = Date.now() - last;
	last = Date.now();

	for (let wall of walls) {
		if (wallDist(wall, ball.position) < ball.radius) {
			const d = ball.velocity;
			const n = Vec.normalize(Vec.rotate(wall.direction, 0.5 * Math.PI));
			ball.velocity = Vec.subtract(d, Vec.scale(n, 2 * Vec.dot(d, n)));
			break;
		}
	}

	for (let hole of holes) {
		if (Vec.distance(hole.position, ball.position) < hole.radius) {
			alert("you lose");
			location.reload();
		}
	}

	ball.velocity = Vec.scale(ball.velocity, 0.999);
	ball.position = Vec.add(ball.position, Vec.scale(ball.velocity, delta / 1000));
};

const wallDist = (wall, point) => {
	const v = Vec.subtract(point, wall.position);
	const d = Math.min(wall.length, Math.max(0, Vec.dot(v, wall.direction)));
	return Vec.distance(Vec.add(wall.position, Vec.scale(wall.direction, d)), point);
};

const draw = () => {
	update();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw holes
	for (let hole of holes) {
		ctx.beginPath();
		ctx.arc(hole.position.x, hole.position.y, hole.radius, 0, 2 * Math.PI);
		ctx.fillStyle = options.holeColor;
		ctx.fill();
	}

	// Draw ball
	ctx.beginPath();
	ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
	ctx.fillStyle = options.ballColor;
	ctx.fill();
	
	// Draw walls
	for (let wall of walls) {
		ctx.beginPath();
		ctx.moveTo(wall.position.x, wall.position.y);
		const end = Vec.add(wall.position, Vec.scale(wall.direction, wall.length));
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}

	requestAnimationFrame(draw);
};

canvas.width = options.worldSize.x;
canvas.height = options.worldSize.y;
draw();