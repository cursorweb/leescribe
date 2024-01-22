
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const W = 256, H = 256, PI = Math.PI;
canvas.width = W;
canvas.height = H;


/** Thickness */
const TH = 20;
const blue = "#4285f4";

ctx.lineWidth = TH;
ctx.strokeStyle = "#fff";
ctx.lineCap = "round";

ctx.fillStyle = blue;
ctx.beginPath();
ctx.ellipse(W / 2, H / 2, W / 2, W / 2, 0, 0, 2 * PI);
ctx.fill();



function line(sx, sy, ex, ey) {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
}

function yan(x, y) {
    line(x - 15, y, x + 15, y);

    line(x - 40, y + TH + 10, x + 40, y + TH + 10);

    line(x - 15, y + 2 * (TH + 10), x + 15, y + 2 * (TH + 10));
    line(x - 15, y + 3 * (TH + 10), x + 15, y + 3 * (TH + 10));

    ctx.beginPath();
    ctx.roundRect(x - 20, y + 4 * (TH + 10), 40, 40, 10);
    ctx.stroke();
}

function mai(x, y) {
    line(x - 20, y + TH / 2, x + 20, y + TH / 2);
    line(x, y - TH / 2, x, y + 3 * TH / 2);

    line(x - 35, y + 2 * TH, x + 35, y + 2 * TH);
    line(x + 35, y + 2 * TH, x + 35, y + 2 * TH + 25);
}

function shi(x, y) {
    // ctx.strokeStyle = "orange";
    line(x - 3 * 3, y - 2 * 3, x + 3 * 3, y + 2 * 3);
    line(x - 3 * 3 + 15, y - 2 * 3 - 30, x + 3 * 3 + 15, y + 2 * 3 - 30);

    // line(x - 10 + 10, y + 40 + 10, x + 60 + 10, y - 20 + 10);

    const X = 40, Y = 40;

    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    // ctx.quadraticCurveTo(x + 30, y + 80, x + 70, y - 10);
    ctx.quadraticCurveTo(x + X, y + Y, x + 70, y - 10);
    ctx.stroke();

    // line(x + X, y + Y, x + X, y + Y);
}

yan(80, 50);
mai(180, 50);
shi(150, 160);