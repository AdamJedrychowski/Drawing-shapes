var circles = [];

function setup() {
    var canvas = createCanvas(600, 400);
    canvas.parent('draw')
    canvas.addClass('mx-auto');
    background(255);
}

function draw() {
    ellipse(width / 2, height / 2, 50, 50);
}