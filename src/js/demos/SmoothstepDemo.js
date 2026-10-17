import { smoothstep } from '@ashwinthomas/utils/motion';
import { Component } from '../core/Component.js';
import { RangeField } from '../components/RangeField.js';
import { plotPath } from '../core/plot.js';

const toX = (x) => 20 + x * 200;
const toY = (y) => 120 - y * 100;

/** smoothstep() curve with adjustable edges. */
export class SmoothstepDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    const update = () => this.render();
    this.e0 = new RangeField(this.ref('e0'), this.ref('e0-out'), update);
    this.e1 = new RangeField(this.ref('e1'), this.ref('e1-out'), update);
    this.els = { path: this.ref('path'), e0: this.ref('e0-line'), e1: this.ref('e1-line') };
    this.render();
  }

  render() {
    const e0 = this.e0.value;
    const e1 = this.e1.value;
    const x0 = toX(e0).toFixed(1);
    const x1 = toX(e1).toFixed(1);
    this.setAttrs(this.els.path, { d: plotPath((x) => smoothstep(e0, e1, x), 0, 1, 100, toX, toY) });
    this.setAttrs(this.els.e0, { x1: x0, x2: x0 });
    this.setAttrs(this.els.e1, { x1: x1, x2: x1 });
  }
}
