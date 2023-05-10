const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext("2d");

const image1 = new Image();
image1.src = 'Stranger_Things_logo.png'
image1.onload = function initialize() {
    canvas.width = image1.width;
    canvas.height = image1.height;
    ctx.drawImage(image1, 0, 0)
}