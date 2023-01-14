
function saveRec() {
    if (circles.length == 0) return;
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(circles)
    }).catch(error => console.error('Error:', error));
}

function load() {
    alert(1);
}

function apply(num) {
    fetch('/circles/'+num, { method: 'GET' })
    .then(res => res.json()).then(data => {
        var circles = [];
        for (var circle of data) {
            circles.push({'radius': circle.radius, 'time': circle.time});
        }
        alert(encodeURIComponent(JSON.stringify([])));
        window.location.href = '/?circles' + encodeURIComponent(JSON.stringify(circles));//problem
    }).catch(error => console.error('Error:', error));
}

function deleteRec(num) {
        fetch('/delete/'+num, { method: 'DELETE' }).catch(error => console.error('Error:', error));
        document.getElementById('circle-'+num).remove();
}