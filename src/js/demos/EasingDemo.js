import * as easings from '@ashwinthomas/utils/easing';
import { clamp, lerp } from '@ashwinthomas/utils/math';
import { Component } from '../core/Component.js';
import { PillGroup } from '../components/PillGroup.js';
import { pingPong, plotPath, prefersReducedMotion } from '../core/plot.js';

const toX = (t) => 20 + t * 200;
const toY = (v) => 160 - v * 120;

/** Plots the selected easing function and runs a dot and a block along it. */
export class EasingDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.period = +root.dataset.speed || 1.6;
    this.picker = new PillGroup(this.ref('pick'), () => this.select());
    this.els = {
      path: this.ref('path'),
      dot: this.ref('dot'),
      area: this.ref('area'),
      code: this.ref('code'),
      result: this.ref('result'),
    };
    this.t = 0;
    this.select();

    if (prefersReducedMotion()) this.render(0.5);
    else this.animate((_dt, time) => this.render(pingPong(time, this.period)));
  }

  select() {
    this.name = this.picker.value;
    this.ease = easings[this.name] || easings.linear;
    this.setAttrs(this.els.path, { d: plotPath(this.ease, 0, 1, 80, toX, toY) });
    this.render(this.t);
  }

  render(t) {
    this.t = t;
    const e = this.ease(t);
    this.setAttrs(this.els.dot, { cx: toX(t).toFixed(1), cy: toY(e).toFixed(1) });
    // 0–1 maps to 10–90% of the track, leaving room for Back's overshoot.
    this.els.area.style.setProperty('--x', lerp(10, 90, clamp(e, -0.15, 1.15)).toFixed(2));
    this.setText(this.els.code, `${this.name}(${t.toFixed(2)})`);
    this.setText(this.els.result, e.toFixed(3));
  }
}
