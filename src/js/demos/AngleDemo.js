import { degToRad, lerpAngle, normalizeAngle, radToDeg } from '@ashwinthomas/utils/angle';
import { lerp } from '@ashwinthomas/utils/math';
import { Component } from '../core/Component.js';
import { RangeField } from '../components/RangeField.js';
import { fmt } from '../core/format.js';

const C = 110;
// SVG y grows downward, so flip sin to draw angles counter-clockwise.
const point = (rad, r) => ({ x: (C + r * Math.cos(rad)).toFixed(2), y: (C - r * Math.sin(rad)).toFixed(2) });

/** lerpAngle() against plain lerp() on a dial. */
export class AngleDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    const update = () => this.render();
    this.a = new RangeField(this.ref('a'), this.ref('a-out'), update, 0);
    this.b = new RangeField(this.ref('b'), this.ref('b-out'), update, 0);
    this.t = new RangeField(this.ref('t'), this.ref('t-out'), update);
    this.els = Object.fromEntries(
      ['ray-a', 'ray-b', 'ray-n', 'ray-l', 'dot-l', 'label-a', 'label-b', 'out-l', 'out-n'].map((k) => [k, this.ref(k)]),
    );
    this.render();
  }

  ray(el, rad, r) {
    const p = point(rad, r);
    this.setAttrs(el, { x2: p.x, y2: p.y });
  }

  label(el, rad) {
    const p = point(rad, 96);
    this.setAttrs(el, { x: p.x, y: (+p.y + 4).toFixed(2) });
  }

  render() {
    const a = degToRad(this.a.value);
    const b = degToRad(this.b.value);
    const t = this.t.value;
    const shortest = lerpAngle(a, b, t);
    const naive = lerp(a, b, t);
    const els = this.els;
    const tip = point(shortest, 64);

    this.ray(els['ray-a'], a, 80);
    this.ray(els['ray-b'], b, 80);
    this.ray(els['ray-n'], naive, 64);
    this.ray(els['ray-l'], shortest, 64);
    this.setAttrs(els['dot-l'], { cx: tip.x, cy: tip.y });
    this.label(els['label-a'], a);
    this.label(els['label-b'], b);
    this.setText(els['out-l'], `${fmt(shortest)} rad · ${fmt(radToDeg(normalizeAngle(shortest)), 1)}°`);
    this.setText(els['out-n'], `${fmt(naive)} rad · ${fmt(radToDeg(naive), 1)}°`);
  }
}
