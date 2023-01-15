
function saveRec() {
    if (circles.length == 0) return;
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(circles)
    }).catch(error => console.error('Error:', error));
}

function apply(num) {
    fetch('/circles/'+num, { method: 'GET' })
    .then(res => res.json()).then(data => {
        var circles = [];
        for (var circle of data) {
            circles.push({'radius': circle.radius, 'time': circle.time});
        }
        document.cookie = "circles=" + JSON.stringify(circles) + ";";
        window.location.href = '/';
    }).catch(error => console.error('Error:', error));
}

function deleteRec(num) {
        fetch('/delete/'+num, { method: 'DELETE' }).catch(error => console.error('Error:', error));
        var node = document.getElementById('circle-'+num);
        node.nextElementSibling.remove();
        node.remove();
}