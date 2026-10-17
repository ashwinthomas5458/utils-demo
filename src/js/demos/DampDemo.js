import { clamp, near } from '@ashwinthomas/utils/math';
import { damp } from '@ashwinthomas/utils/motion';
import { Component } from '../core/Component.js';
import { RangeField } from '../components/RangeField.js';
import { fmt } from '../core/format.js';

const KEY_STEPS = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };

/** A ball that damps toward a target set by clicking, dragging or arrow keys. */
export class DampDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.area = this.ref('area');
    this.code = this.ref('code');
    this.result = this.ref('result');
    this.x = 10;
    this.target = +this.area.getAttribute('aria-valuenow');
    this.lambda = new RangeField(this.ref('lambda'), this.ref('lambda-out'), () => this.renderCode(), 1);

    this.on(this.area, 'pointerdown', (e) => {
      this.area.setPointerCapture(e.pointerId);
      this.setTargetFromPointer(e);
    });
    this.on(this.area, 'pointermove', (e) => {
      if (this.area.hasPointerCapture(e.pointerId)) this.setTargetFromPointer(e);
    });
    this.on(this.area, 'keydown', (e) => this.onKey(e));

    this.setTarget(this.target);
    this.animate((dt) => this.tick(dt));
  }

  setTargetFromPointer(e) {
    const rect = this.area.getBoundingClientRect();
    this.setTarget(((e.clientX - rect.left) / rect.width) * 100);
  }

  onKey(e) {
    let next = null;
    if (e.key in KEY_STEPS) next = this.target + KEY_STEPS[e.key] * (e.shiftKey ? 20 : 5);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 100;
    if (next === null) return;
    e.preventDefault();
    this.setTarget(next);
  }

  setTarget(value) {
    this.target = clamp(value, 0, 100);
    this.area.style.setProperty('--target', this.target.toFixed(2));
    this.area.setAttribute('aria-valuenow', Math.round(this.target));
    this.renderCode();
  }

  tick(dt) {
    if (near(this.x, this.target, 0.005)) {
      if (this.x === this.target) return;
      this.x = this.target;
    } else {
      this.x = damp(this.x, this.target, this.lambda.value, dt);
    }
    this.area.style.setProperty('--x', this.x.toFixed(3));
    this.setText(this.result, fmt(this.x, 2));
  }

  renderCode() {
    this.setText(this.code, `x = damp(x, ${fmt(this.target, 1)}, ${fmt(this.lambda.value, 1)}, dt)`);
  }
}
