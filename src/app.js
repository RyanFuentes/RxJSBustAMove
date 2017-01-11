import Rx from 'rx';
import {drawArrow} from './arrow';

const TICKER_INTERVAL = 17;
const BUBBLE_SHOOT_KEYCODE = 32;
const BUBBLE_COOLDOWN = 2000;
const ARROW_SPEED = 50;
const ARROW_LENGTH = 100;
const ARROW_MAX_ANGLE = 70;
const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

const clearStage = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

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

const game$ = Rx.Observable
  .combineLatest(ticker$, arrow$)
  .sample(TICKER_INTERVAL)
  .subscribe(([ticker, arrow]) => {
    clearStage();
    drawArrow(ctx, canvas, arrow);
  });

drawArrow(ctx, canvas, 0);
