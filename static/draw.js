var circles = [];
var i = 0, time = 1;
var path = [];

window.onload = function() {
    cookieCircles = getCookie()['circles'];
    if(cookieCircles) {
        for (var circle of JSON.parse(cookieCircles)) {
            circles.push([circle.radius, circle.time]);
            addButtonNode(circle.radius, circle.time);
        }
        start();
        document.cookie = document.cookie.replace("]", "];expires=Thu, 01 Jan 1970 00:00:00 GMT");
    }
}

function getCookie() {
    var cookies = document.cookie;
    var data = {};
    cookies.split(";").forEach(assignment => {
        let [key, value] = assignment.split("=");
        key = key.trim();
        data[key] = value;
    });
    return data;
}

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
    node.innerHTML = "<h4 id='exist-" + circle + "'>Circle number " + circle + "</h4>\
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

function addButtonNode(radius, time) {
    var node = document.getElementById("circlesList");
    var nodeCount = node.childElementCount + 1;
    const newNode = document.createElement("li");
    newNode.innerHTML = "<div class='row no-gutters'>\
                            <div class='col-8'>\
                                <button id='node-"+ nodeCount +"' onclick='circleSettings(" + nodeCount + ")' class='dropdown-item btn-sm' style=';margin-left: 15px;'>R="+radius+", T="+time+"</button>\
                            </div>\
                            <div class='col-4'>\
                                <button type='button' onclick='delCircle(" + nodeCount + ")' class='close' style='color:red;margin-right: 20px;'>&times;</button>\
                            </div>\
                        </div>";
    node.appendChild(newNode);
    return nodeCount;
}

function addCircle() {
    circles.push([1, 1]);
    circleSettings(addButtonNode(1, 1));
}

function delCircle(num) {
    circles.splice(num-1, 1);
    path = [];
    var node = document.getElementById("circlesList");
    node.removeChild(node.childNodes[num-1]);
    if(circles.length == 0) background(255);
    var currentCircle = document.querySelector("[id^='exist-']");
    var currNum = -1;
    if(currentCircle) {
        let id = currentCircle.id;
        currNum = id.split("-")[1];
    }
    
    var node = document.getElementById("circlesList").querySelectorAll("li");
    for(let i=0; i<node.length; i++) {
        node[i].innerHTML = "<div class='row no-gutters'>\
                                <div class='col-8'>\
                                    <button id='node-"+ (i+1) +"' onclick='circleSettings(" + (i+1) + ")' class='dropdown-item btn-sm' style=';margin-left: 15px;'>R="+circles[i][0]+", T="+circles[i][1]+"</button>\
                                </div>\
                                <div class='col-4'>\
                                    <button type='button' onclick='delCircle(" + (i+1) + ")' class='close' style='color:red;margin-right: 20px;'>&times;</button>\
                                </div>\
                            </div>";
    }
    document.getElementById("circle").innerHTML = "";
    if(num == currNum || currNum == -1) return;
    else if(num > currNum)  circleSettings(currNum);
    else if(num < currNum) circleSettings(currNum-1);
}