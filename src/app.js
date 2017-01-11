import Rx from 'rx';

const TICKER_INTERVAL = 17;
const BUBBLE_SHOOT_KEYCODE = 32;
const BUBBLE_COOLDOWN = 2000;

import Stage from './stage';

const stage = new Stage('stage');

const drawTitle = (ctx, canvas, props) => {
  ctx.textAlign = 'center';
  ctx.font = '24px Courier New';
  ctx.fillText('rxjs bust a move', canvas.width / 2, canvas.height / 2 - 24);
};



const clearStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;

const arrowKeysDown$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === ARROW_LEFT_KEYCODE || e.keyCode === ARROW_RIGHT_KEYCODE);

const arrowKeysUp$ = Rx.Observable
  .fromEvent(document, 'keyup')
  .filter(e => e.keyCode === ARROW_LEFT_KEYCODE || e.keyCode === ARROW_RIGHT_KEYCODE);

const arrowMovement$ = Rx.Observable
  .merge(arrowKeysDown$, arrowKeysUp$)
  .scan(
    (previous, current) => {
      if (current.type === 'keyup' &&
          previous.type === 'keydown' &&
          current.keyCode !== previous.keyCode) {
            return previous;
          }
      return current;
    }
  )
  .map(e => {
    if (e.type === 'keyup') return 0;
    if (e.keyCode === ARROW_LEFT_KEYCODE) return -1;
    if (e.keyCode === ARROW_RIGHT_KEYCODE) return 1;
  })
  .distinctUntilChanged();

const bubbleShooter$ = Rx.Observable
  .fromEvent(document, 'keydown')
  .filter(e => e.keyCode === BUBBLE_SHOOT_KEYCODE)
  .throttle(2000);

const ticker$ = Rx.Observable
  .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame)
  .map(() => ({
    time: Date.now(),
    deltaTime: null
  }))
  .scan(
    (previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time) / 1000
    })
  );

const arrow$ = ticker$
  .withLatestFrom(arrowMovement$)
  .scan((position, [ticker, direction]) => {
    let nextPosition = position + direction * ticker.deltaTime * ARROW_SPEED;

    if (nextPosition > ARROW_MAX_ANGLE)       return ARROW_MAX_ANGLE;
    if (nextPosition < ARROW_MAX_ANGLE * -1)  return ARROW_MAX_ANGLE * -1;
    return nextPosition;
  }, 0)
  .distinctUntilChanged();

const update = ([ticker, arrow]) => {
  clearStage();
  drawArrow(arrow);
}

const game$ = Rx.Observable
  .combineLatest(ticker$, arrow$)
  .sample(TICKER_INTERVAL)
  .subscribe(update);

drawTitle();
drawArrow();
