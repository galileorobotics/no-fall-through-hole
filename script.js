const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
	worldSize: {x: 300, y: 300}
};

const ball = {
	position: Vec.scale(options.worldSize, 0.5),
	velocity: {x: -50, y: -120},
	radius: 10,
};

const walls = [
	{position: {x: 100, y: 100}, direction: {x: 1, y: 0}, length: 100},
	{position: {x: 100, y: 100}, direction: {x: 0, y: 1}, length: 100},
]

let last = Date.now();
const update = () => {
	const delta = Date.now() - last;
	last = Date.now();

	ball.velocity = Vec.scale(ball.velocity, 0.99)
	ball.position = Vec.add(ball.position, Vec.scale(ball.velocity, delta / 1000));

	for (let wall of walls) {
		if (wallDist(wall, ball.position) < ball.radius)
			// TODO: Calculate new velocity
	}
};

const wallDist = (wall, point) => {
	const v = Vec.subtract(point, wall.position);
	const d = Vec.dot(v, wall.direction);
	return Vec.distance(Vec.add(wall.position, Vec.scale(wall.direction, d)), point);
};

const draw = () => {
	update();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();
	ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
	ctx.fill();

	for (let wall of walls) {
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