import { clamp, invlerp, mod, near, roundTo, sign, snap } from '@ashwinthomas/utils/math';
import { Component } from '../core/Component.js';
import { RangeField } from '../components/RangeField.js';
import { fmt } from '../core/format.js';

// Keys match each tile's data-fn attribute.
const FNS = {
  clamp: (n) => clamp(n, 0, 10),
  snap: (n) => snap(n, 2.5),
  roundTo1: (n) => roundTo(n, 1),
  roundToNeg: (n) => roundTo(n, -1),
  mod: (n) => mod(n, 5),
  sign: (n) => sign(n),
  invlerp: (n) => invlerp(-20, 20, n),
  near: (n) => near(n, 0, 0.5),
};

/** One slider driving a grid of small math readouts. */
export class MathGridDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.n = new RangeField(this.ref('n'), this.ref('n-out'), () => this.render());
    this.outputs = this.$$('[data-fn]').filter((el) => FNS[el.dataset.fn]);
    this.render();
  }

  render() {
    const n = this.n.value;
    this.outputs.forEach((el) => {
      const value = FNS[el.dataset.fn](n);
      this.setText(el, typeof value === 'number' ? fmt(value) : String(value));
    });
  }
}
