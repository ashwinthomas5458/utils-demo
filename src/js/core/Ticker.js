/**
 * One requestAnimationFrame loop shared by all animated demos. It only runs
 * while it has subscribers and the tab is visible, and it hands each
 * subscriber a clamped delta (seconds) plus a running clock.
 */
export class Ticker {
  constructor({ maxDelta = 0.05 } = {}) {
    this.maxDelta = maxDelta;
    this.subscribers = new Set();
    this.time = 0;
    this.last = 0;
    this.frame = 0;
    this.loop = this.loop.bind(this);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else this.start();
    });
  }

  add(fn) {
    this.subscribers.add(fn);
    this.start();
  }

  remove(fn) {
    this.subscribers.delete(fn);
    if (!this.subscribers.size) this.stop();
  }

  start() {
    if (this.frame || !this.subscribers.size || document.hidden) return;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  loop(now) {
    const dt = Math.min(this.maxDelta, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    this.subscribers.forEach((fn) => fn(dt, this.time));
    this.frame = requestAnimationFrame(this.loop);
  }
}
