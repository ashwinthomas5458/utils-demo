import * as easings from '@ashwinthomas/utils/easing';
import { Component } from '../core/Component.js';
import { pingPong, prefersReducedMotion } from '../core/plot.js';

/**
 * Hero ball eased along the card's x axis: its centre sits at x = ease(t),
 * read against the 0 and 1 marks. Configure with data-easing and data-speed.
 */
export class HeroDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.name = typeof easings[root.dataset.easing] === 'function' ? root.dataset.easing : 'easeOutBack';
    this.ease = easings[this.name];
    this.period = +root.dataset.speed || 1.6;
    this.ball = this.ref('ball');
    this.readout = this.ref('readout');

    if (prefersReducedMotion()) this.render(1);
    else this.animate((_dt, time) => this.render(pingPong(time, this.period)));
  }

  render(t) {
    const e = this.ease(t);
    this.ball.style.setProperty('--e', e.toFixed(4));
    this.setText(this.readout, `${this.name}(${t.toFixed(2)}) = ${e.toFixed(3)}`);
  }
}
