var circles = [];
var i=0;
var path = [];

function setup() {
    var canvas = createCanvas(window.innerWidth / 2, window.innerHeight * 5 / 9);
    canvas.parent('draw')
    canvas.addClass('mx-auto');
    background(255);
    frameRate(60);
}

function start() {
    loop();
}

function stop() {
    noLoop();
}

function clearContent() {
    path = [];
}

function windowResized() {
    resizeCanvas(window.innerWidth / 2, window.innerHeight * 5 / 9);
    background(255);
}

function draw() {
    if(circles.length == 0) return;
    background(255);
    var start = [0, 0], end;
    for(let j=0; j<circles.length; j++) {
        end = [start[0] + Math.sin(i/circles[j][1])*circles[j][0], start[1] + Math.cos(i/circles[j][1])*circles[j][0]];
        line(width/2 + start[0], height/2 + start[1], width/2 + end[0], height/2 + end[1]);
        start = end;
    }
    path.push(start);
    for(let j=0; j<path.length-1; j++) {
        line(width/2 + path[j][0], height/2 + path[j][1], width/2 + path[j+1][0], height/2 + path[j+1][1]);
    }
    i+=Math.PI/30;
}

function setCircle(num) {
    path = [];
    circles[num] = [document.getElementById('rad').value, document.getElementById('time').value];
    alert(document.getElementById(num.toString()));
}

function circleSettings(circle) {
    var node = document.getElementById("circle");
    node.innerHTML = "<h4>Circle number "+circle+"</h4>\
    <form>\
        <div class='form-group'>\
            <label for='rad'>Radius:</label>\
            <input type='text' class='form-control' id='rad' placeholder='Enter radius'>\
        </div>\
        <div class='form-group'>\
            <label for='time'>Time of one rotation:</label>\
            <input type='text' class='form-control' id='time' placeholder='Enter time in seconds'>\
        </div>\
        <input type='button' class='btn btn-primary' value='Submit' onclick='setCircle("+(circle-1)+")'>\
    </form>";
}

function addCircle() {
    var node = document.getElementById("circlesList");
    var nodeCount = node.childElementCount + 1;
    const newNode = document.createElement("li");
    newNode.innerHTML = "<button onClick='circleSettings(" + nodeCount + ")' class='btn btn-defult'>" + nodeCount + " radius - 1, time - 1</button>";
    node.appendChild(newNode);
    circles.push([1,1]);
    circleSettings(nodeCount);
}