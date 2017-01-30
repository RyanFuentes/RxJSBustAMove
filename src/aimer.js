import * as c from './constants';

const getRouteLines = (direction, startX, startY, boardLength, lines=[]) => {
  let endX, endY, newLines;
  if (direction === 90) {
    endX = startX;
    endY = 0;
  } else if (direction > 90) {
    endX = boardLength;
    endY = startY + Math.tan(direction* Math.PI/180) * boardLength/2;
  } else {
    endX = 0;
    endY = startY - Math.tan(direction* Math.PI/180) * boardLength/2;
  }

  newLines = lines.concat({startX, startY, endX, endY});
  if (endY <= 0) {
    return newLines;
  } else {
    return getRouteLines(180 - direction, endX, endY, boardLength, newLines);
  }
};

export const drawAimer = (ctx, canvas, direction, startX, startY) => {
  let lines = getRouteLines(direction, startX, startY, startX*2);

  ctx.save();
  ctx.setLineDash([1, 15]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';

  lines.forEach(l => {
    ctx.beginPath();
    ctx.moveTo(l.startX, l.startY);
    ctx.lineTo(l.endX, l.endY);
    ctx.stroke();
  });

  ctx.restore();
}
