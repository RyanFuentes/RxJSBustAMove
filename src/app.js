import Rx from 'rx';
import {drawArrow, arrow$} from './arrow';
import {ticker$} from './ticker';
import * as c from './constants';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const clearStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const initialBubble = {id: 0, active: false, direction: null, x: 0, y: 0};

const bubbleShooter$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === c.BUBBLE_SHOOT_KEYCODE)
  .throttle(c.BUBBLE_COOLDOWN)
  .withLatestFrom(arrow$)
  .startWith(initialBubble)
  .scan((prev, [e, arrow]) => ({id: prev.id + 1, active: true, direction: arrow, x: 0, y: 0}))
  .distinctUntilChanged();

const bubbleMover$ = ticker$
  .withLatestFrom(bubbleShooter$)
  .scan((prev, [ticker, bubble]) => {
    if (bubble.active) {
      let x = prev.x + ticker.deltaTime * Math.sin(bubble.direction) * 200;
      let y = prev.y + ticker.deltaTime * Math.cos(bubble.direction) * 200;

      return Object.assign({}, bubble, {x, y, active: true});
    } else {
      return bubble;
    }
  }, initialBubble)
  .distinctUntilChanged();

const drawBubble = (ctx, canvas, {x, y, direction, active}) => {

  if (active) {
    ctx.save();

    ctx.translate(canvas.width/2, canvas.height);
    ctx.rotate(direction * Math.PI / 180);

    ctx.beginPath();
    ctx.arc(x, y * -1, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    ctx.restore();
  }

};

const game$ = Rx.Observable
  .combineLatest(ticker$, arrow$, bubbleMover$)
  .sample(c.TICKER_INTERVAL)
  .subscribe(([ticker, arrow, bubbleMover]) => {
    clearStage();
    drawArrow(ctx, canvas, arrow);
    drawBubble(ctx, canvas, bubbleMover);
  });

drawArrow(ctx, canvas, 0);
