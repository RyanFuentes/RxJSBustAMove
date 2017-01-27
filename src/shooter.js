import * as c from './constants';
import {arrow$} from './arrow';
import {ticker$} from './ticker';

export const shooter$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === c.BUBBLE_SHOOT_KEYCODE)
  .throttle(c.BUBBLE_COOLDOWN)
  .scan((prev, cur) => prev + 1, 0)
  .combineLatest(arrow$, ticker$)
  .distinctUntilChanged(n => n[0])
  .map(([e, arrow, ticker]) => ({direction: arrow, time: ticker.time}))
  .scan((prev, curr) => prev.concat(curr), []);
