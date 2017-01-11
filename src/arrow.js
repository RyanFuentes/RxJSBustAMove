const ARROW_LENGTH = 100;
const ARROW_SPEED = 50;
const ARROW_MAX_ANGLE = 70;

const arrow = (ctx, canvas, {angle}) => {
  ctx.save();

  // Arrow specific styling
  ctx.translate(canvas.width/2, canvas.height);
  ctx.rotate(angle * Math.PI / 180);
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 1;
  ctx.fillStyle = 'black';

  // Main arrow line
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -100);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Arrow tip
  ctx.beginPath();
  ctx.moveTo(0, -102);
  ctx.lineTo(-5, -92);
  ctx.lineTo(5, -92);
  ctx.lineTo(0, -100);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0,0,6,-90*Math.PI,90*Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.restore();
};
