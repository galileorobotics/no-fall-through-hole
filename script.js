const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let last = Date.now();
const update = () => {
	const delta = Date.now() - last;
	last = Date.now();
};

const draw = () => {
	update();
	requestAnimationFrame(draw);
};