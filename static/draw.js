var circles = [];
var i = 0, time = 1;
var path = [];

function setup() {
    var canvas = createCanvas(window.innerWidth / 2, window.innerHeight * 5 / 9);
    canvas.parent('draw')
    canvas.addClass('mx-auto');
    background(255);
    frameRate(60);
    noLoop();
}

function start() {
    loop();
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
}

function stop() {
    noLoop();
    document.getElementById('stop').disabled = true;
    document.getElementById('start').disabled = false;
}

function clearContent() {
    path = [];
    background(255);
}

function windowResized() {
    resizeCanvas(window.innerWidth / 2, window.innerHeight * 5 / 9);
    background(255);
}

function draw() {
    if (circles.length == 0) return;
    background(255);
    var start = [0, 0], end;
    for (let j = 0; j < circles.length; j++) {
        end = [start[0] + Math.sin(i / circles[j][1]) * circles[j][0], start[1] + Math.cos(i / circles[j][1]) * circles[j][0]];
        line(width / 2 + start[0], height / 2 + start[1], width / 2 + end[0], height / 2 + end[1]);
        start = end;
    }
    path.push(start);
    for (let j = 0; j < path.length - 1; j++) {
        line(width / 2 + path[j][0], height / 2 + path[j][1], width / 2 + path[j + 1][0], height / 2 + path[j + 1][1]);
    }
    i += Math.PI / 30;

    // if(frameCount/60 >= time) {
    //     i = 0;
    //     path = [];
    //     frameCount = 0;
    // }
}

function setCircle(num) {
    path = [];
    var r = document.getElementById('rad').value, t = document.getElementById('time').value;
    // if(circles.length > num) time /= circles[num][1];
    // time *= t;
    circles[num] = [r,t];
    // frameCount = 0;
    document.getElementById("node-"+(num+1)).textContent = "R="+r+", T="+t;
}

function circleSettings(circle) {
    var node = document.getElementById("circle");
    node.innerHTML = "<h4>Circle number " + circle + "</h4>\
    <form>\
        <div class='form-group mb-2'>\
            <label for='rad'>Radius:</label>\
            <input type='text' class='form-control' id='rad' placeholder='Enter radius'>\
        </div>\
        <div class='form-group mb-2'>\
            <label for='time'>Time of one rotation:</label>\
            <input type='text' class='form-control' id='time' placeholder='Enter time in seconds'>\
        </div>\
        <input type='button' class='btn btn-primary' value='Submit' onclick='setCircle("+ (circle - 1) + ")'>\
    </form>";
}

function addCircle() {
    var node = document.getElementById("circlesList");
    var nodeCount = node.childElementCount + 1;
    const newNode = document.createElement("li");
    newNode.innerHTML = "<div class='row no-gutters'>\
                            <div class='col-8'>\
                                <button id='node-"+ nodeCount +"' onclick='circleSettings(" + nodeCount + ")' class='dropdown-item btn-sm' style=';margin-left: 15px;'>R=1, T=1</button>\
                            </div>\
                            <div class='col-4'>\
                                <button type='button' onclick='delCircle(" + nodeCount + ")' class='close' style='color:red;margin-right: 20px;'>&times;</button>\
                            </div>\
                        </div>";
    node.appendChild(newNode);
    circles.push([1, 1]);
    circleSettings(nodeCount);
}

function delCircle(num) {
    circles.splice(num, 1);
    var node = document.getElementById("circlesList");
    node.removeChild(node.childNodes[num-1]);
}