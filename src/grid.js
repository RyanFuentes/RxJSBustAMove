export const drawGrid = (ctx, canvas, w, h) => {
  ctx.save();
  ctx.strokeStyle = "#D0D0D0";
  for (var x = 1; x < w * 2; x++) {
    ctx.beginPath();
    ctx.moveTo(x * canvas.width/w / 2, 0);
    ctx.lineTo(x * canvas.width/w / 2, canvas.height);
    ctx.stroke();
  }

  for (var y = 1; y < h * 2; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * canvas.height/h/2);
    ctx.lineTo(canvas.width, y * canvas.height/h/2);
    ctx.stroke();
  }
  ctx.restore();
}
