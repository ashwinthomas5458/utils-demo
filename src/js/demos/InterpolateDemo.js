import { clamp, interpolate } from '@ashwinthomas/utils/math';
import { Component } from '../core/Component.js';
import { PillGroup } from '../components/PillGroup.js';
import { RangeField } from '../components/RangeField.js';
import { fmt } from '../core/format.js';
import { plotPath } from '../core/plot.js';

const MIN = -50;
const MAX = 150;
const toX = (v) => 20 + ((v - MIN) / (MAX - MIN)) * 280;
const toY = (v) => clamp(150 - ((v + 0.75) / 2.5) * 140, 6, 154);

/** interpolate() with switchable range direction, output shape and extrapolation. */
export class InterpolateDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    const update = () => this.render();
    this.dir = new PillGroup(this.ref('dir'), update);
    this.shape = new PillGroup(this.ref('shape'), update);
    this.mode = new PillGroup(this.ref('ex'), update);
    this.value = new RangeField(this.ref('value'), this.ref('value-out'), update, 0);
    this.els = {
      path: this.ref('path'),
      marker: this.ref('marker'),
      dot: this.ref('dot'),
      code: this.ref('code'),
      result: this.ref('result'),
    };
    this.render();
  }

  ranges() {
    const asc = this.dir.value === 'asc';
    if (this.shape.value === 'peak') {
      return { input: asc ? [0, 50, 100] : [100, 50, 0], output: [0, 1, 0] };
    }
    return { input: asc ? [0, 100] : [100, 0], output: [0, 1] };
  }

  render() {
    const { input, output } = this.ranges();
    const mode = this.mode.value;
    const v = this.value.value;
    const out = interpolate(v, input, output, mode);
    const x = toX(v).toFixed(1);
    const { path, marker, dot, code, result } = this.els;

    this.setAttrs(path, { d: plotPath((n) => interpolate(n, input, output, mode), MIN, MAX, 100, toX, toY) });
    this.setAttrs(marker, { x1: x, x2: x });
    this.setAttrs(dot, { cx: x, cy: toY(out).toFixed(1) });
    this.setText(code, `interpolate(${v}, [${input.join(', ')}], [${output.join(', ')}], '${mode}')`);
    this.setText(result, fmt(out));
  }
}
