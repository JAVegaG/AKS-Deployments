const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear");

const rect = canvas.getBoundingClientRect();

var offset = 0;

window.onscroll = function (e) {
    offset = window.scrollY;
};

canvas.addEventListener('mousedown', (event) => {
    let posX = event.clientX - rect.left - 3;
    let posY = event.clientY - rect.top + offset - 3;
    context.moveTo(posX, posY);
    context.beginPath();
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

var onPaint = (event) => {
    let posX = event.clientX - rect.left - 3;
    let posY = event.clientY - rect.top + offset - 3;
    console.log(posX, posY)
    context.lineTo(posX, posY);
    context.strokeStyle = 'green';
    context.lineWidth = 20;
    context.stroke();
}

clearButton.addEventListener('click', (event) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}, false);

canvas.addEventListener('mouseup', function () {
    $('#number').html('<img id="spinner" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921"/>');
    canvas.removeEventListener('mousemove', onPaint, false);

    const img = document.getElementById("inputN")

    img.src = canvas.toDataURL()

    context.drawImage(canvas, 0, 0, 28, 28);

    var data = context.getImageData(0, 0, 28, 28).data;

    var input = [];

    for (var i = 0; i < data.length; i += 4) {
        input.push((data[i + 1]) / 255);
    }
    predict(input);

}, false);

// Setting up tfjs with the model we downloaded
tf.loadLayersModel('model/model.json')
    .then(function (model) {
        window.model = model;
    });


// Predict function
var predict = function (input) {
    // console.log(input)
    if (window.model) {
        window.model.predict([tf.tensor(input)
            .reshape([1, 28 * 28])])
            .array().then((scores) => {
                var scores = scores[0];
                // const dimensions = [
                //     scores.length,
                //     scores.reduce((x, y) => Math.max(x, y.length), 0)
                // ];
                // console.log(dimensions)
                // console.log(scores)
                var predictedvalue = scores
                    .indexOf(Math.max(...scores));
                // console.log(predictedvalue)
                $('#number').html(predictedvalue);
            });
    } else {

        // The model takes a bit to load,
        // if we are too fast, wait
        setTimeout(function () { predict(input) }, 50);
    }
}