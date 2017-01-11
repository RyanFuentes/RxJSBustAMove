import Rx from 'rx';
import {drawArrow, arrow$} from './arrow';
import {ticker$} from './ticker';
import * as c from './constants';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const clearStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const bubbleShooter$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === c.BUBBLE_SHOOT_KEYCODE)
  .throttle(c.BUBBLE_COOLDOWN);

const game$ = Rx.Observable
  .combineLatest(ticker$, arrow$)
  .sample(c.TICKER_INTERVAL)
  .subscribe(([ticker, arrow]) => {
    clearStage();
    drawArrow(ctx, canvas, arrow);
  });

drawArrow(ctx, canvas, 0);
