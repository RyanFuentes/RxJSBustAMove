import Rx from 'rx';
import {drawArrow, arrow$} from './arrow';
import {drawAimer} from './aimer';
import {drawGrid} from './grid';
import {ticker$} from './ticker';
import {shooter$} from './shooter';
import * as c from './constants';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const clearStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const game$ = Rx.Observable
  .combineLatest(ticker$, arrow$)
  .sample(c.TICKER_INTERVAL)
  .subscribe(([ticker, arrow]) => {
    clearStage();
    drawGrid(ctx, canvas, c.BUBBLE_MAX_W, c.BUBBLE_MAX_H);
    drawArrow(ctx, canvas, arrow);
    drawAimer(ctx, canvas, arrow, canvas.width/2, canvas.height);
  });

shooter$.subscribe(bubbles => console.log(JSON.stringify(bubbles.slice(-1)[0])));
