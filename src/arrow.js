import Rx from 'rx';
import {ticker$} from './ticker';
import * as c from './constants';

const arrowKeysDown$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === c.ARROW_LEFT_KEYCODE || e.keyCode === c.ARROW_RIGHT_KEYCODE)
  .map(e => e.keyCode === c.ARROW_LEFT_KEYCODE ? {left: 1} : {right: 1});

const arrowKeysUp$ = Rx.Observable
  .fromEvent(document, 'keyup')
  .filter(e => e.keyCode === c.ARROW_LEFT_KEYCODE || e.keyCode === c.ARROW_RIGHT_KEYCODE)
  .map(e => e.keyCode === c.ARROW_LEFT_KEYCODE ? {left: 0} : {right: 0});

const arrowMovement$ = Rx.Observable
  .merge(arrowKeysDown$, arrowKeysUp$)
  .scan((previous, current) => ({...previous, ...current}), {left: 0, right: 0})
  .map(a => a.right - a.left)
  .distinctUntilChanged();

export const arrow$ = ticker$
  .withLatestFrom(arrowMovement$)
  .startWith(c.ARROW_START_ANGLE)
  .scan((position, [ticker, direction]) => {
    let nextPosition = position + direction * ticker.deltaTime * c.ARROW_SPEED;

    if (nextPosition > c.ARROW_MAX_ANGLE)       return c.ARROW_MAX_ANGLE;
    if (nextPosition < (180-c.ARROW_MAX_ANGLE))  return (180-c.ARROW_MAX_ANGLE);
    return nextPosition;
  })
  .distinctUntilChanged();

export const drawArrow = (ctx, canvas, angle) => {
  ctx.save();

  // Arrow specific styling
  ctx.translate(canvas.width/2, canvas.height);
  ctx.rotate(angle * Math.PI/180 - Math.PI/2);
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 1;
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';

  // Main arrow line
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -1 * c.ARROW_LENGTH);
  ctx.lineWidth = 3;
  ctx.stroke();

  // Arrow tip
  ctx.beginPath();
  ctx.moveTo(0, -1 * c.ARROW_LENGTH - 2);
  ctx.lineTo(-5, -1 * c.ARROW_LENGTH + 8);
  ctx.lineTo(5, -1 * c.ARROW_LENGTH + 8);
  ctx.lineTo(0, -1 * c.ARROW_LENGTH);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fill();

  //Arrow bottom
  ctx.beginPath();
  ctx.arc(0,0,6,-90*Math.PI,90*Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.restore();
};
