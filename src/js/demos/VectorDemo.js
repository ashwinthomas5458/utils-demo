import { near } from '@ashwinthomas/utils/math';
import { Vector2, add, dot, magnitude, normalize, subtract } from '@ashwinthomas/utils/vector';
import { DragPad } from '../core/DragPad.js';
import { fmt, fmtVec } from '../core/format.js';

/**
 * Two arrows, a and b, from the pad's centre. One grid square is one unit,
 * and y counts upward, so the readouts match a graph on paper.
 */
export class VectorDemo extends DragPad {
  constructor(root, ticker) {
    super(root, ticker);
    this.unit = +root.dataset.unit || 40;
    this.origin = { x: this.size.w / 2, y: this.size.h / 2 };
    this.els = {
      arrowA: this.ref('arrow-a'),
      arrowB: this.ref('arrow-b'),
      sum: this.ref('sum'),
      sumLabel: this.ref('sum-label'),
      guide: this.ref('guide'),
      unitDot: this.ref('unit-dot'),
    };
    this.render();
  }

  /** SVG point → vector in grid units (y up). */
  toVec(p) {
    return { x: (p.x - this.origin.x) / this.unit, y: (this.origin.y - p.y) / this.unit };
  }

  /** Vector in grid units → SVG coordinates, as fixed-precision strings. */
  toSvgPoint(v) {
    return { x: (this.origin.x + v.x * this.unit).toFixed(2), y: (this.origin.y - v.y * this.unit).toFixed(2) };
  }

  render() {
    const { els, outputs: out } = this;
    this.renderHandles();

    const a = this.toVec(this.points.a);
    const b = this.toVec(this.points.b);
    const sum = add(a, b);
    const unitA = normalize(a);
    const product = dot(a, b);

    const pa = this.toSvgPoint(a);
    const pb = this.toSvgPoint(b);
    const ps = this.toSvgPoint(sum);
    const pu = this.toSvgPoint(unitA);
    this.setAttrs(els.arrowA, { x2: pa.x, y2: pa.y });
    this.setAttrs(els.arrowB, { x2: pb.x, y2: pb.y });
    this.setAttrs(els.sum, { x2: ps.x, y2: ps.y });
    this.setAttrs(els.sumLabel, { x: ps.x, y: (+ps.y - 12).toFixed(2) });
    this.setAttrs(els.guide, { d: `M${pa.x} ${pa.y}L${ps.x} ${ps.y}M${pb.x} ${pb.y}L${ps.x} ${ps.y}` });
    this.setAttrs(els.unitDot, { cx: pu.x, cy: pu.y });

    let meaning;
    if (near(magnitude(a), 0) || near(magnitude(b), 0)) meaning = 'a zero-length arrow';
    else if (near(product, 0, 0.01)) meaning = 'at right angles';
    else meaning = product > 0 ? 'roughly the same way' : 'pointing apart';

    this.setText(out.ab, `${fmtVec(a)}, ${fmtVec(b)}`);
    this.setText(out.add, fmtVec(sum));
    this.setText(out.subtract, fmtVec(subtract(a, b)));
    this.setText(out.magnitude, fmt(magnitude(a), 2));
    this.setText(out.normalize, fmtVec(unitA));
    this.setText(out.dot, `${fmt(product, 2)} · ${meaning}`);
    this.setText(out.chain, fmtVec(Vector2.from(a).add(b).scale(0.5)));
  }
}
