import { angle, distance, intersection, polar, rotatePoint } from '@ashwinthomas/utils/geometry';
import { Vector2 } from '@ashwinthomas/utils/vector';
import { DragPad } from '../core/DragPad.js';
import { fmt, fmtVec } from '../core/format.js';

/** Two draggable segments with live geometry readouts. */
export class GeometryDemo extends DragPad {
  constructor(root, ticker) {
    super(root, ticker);
    this.els = {
      segA: this.ref('seg-a'),
      segB: this.ref('seg-b'),
      normal: this.ref('normal'),
      mid: this.ref('mid'),
      ix: this.ref('ix'),
    };
    this.render();
  }

  render() {
    const { points: p, els, outputs: out } = this;
    const H = this.size.h;
    // Points are stored in SVG space (y down); readouts count y upward, as the library does.
    const yUp = (q) => ({ x: q.x, y: H - q.y });

    this.renderHandles();
    this.setAttrs(els.segA, { x1: p.a1.x, y1: p.a1.y, x2: p.a2.x, y2: p.a2.y });
    this.setAttrs(els.segB, { x1: p.b1.x, y1: p.b1.y, x2: p.b2.x, y2: p.b2.y });

    const a1 = yUp(p.a1);
    const a2 = yUp(p.a2);
    const b1 = yUp(p.b1);
    const b2 = yUp(p.b2);
    const heading = angle(a1, a2);
    const ix = intersection(a1, a2, b1, b2);
    const mid = Vector2.from(a1).lerp(a2, 0.5);
    const tip = polar(24, heading + Math.PI / 2, mid);
    const rotated = rotatePoint(b2, Math.PI / 2, b1);

    els.ix.toggleAttribute('hidden', !ix);
    if (ix) this.setAttrs(els.ix, { cx: ix.x.toFixed(2), cy: (H - ix.y).toFixed(2) });
    this.setAttrs(els.mid, { cx: mid.x.toFixed(2), cy: (H - mid.y).toFixed(2) });
    this.setAttrs(els.normal, {
      x1: mid.x.toFixed(2),
      y1: (H - mid.y).toFixed(2),
      x2: tip.x.toFixed(2),
      y2: (H - tip.y).toFixed(2),
    });

    this.setText(out.distance, fmt(distance(a1, a2), 2));
    this.setText(out.angle, `${fmt(heading)} rad`);
    this.setText(out.intersection, ix ? fmtVec(ix) : 'null');
    this.setText(out.mid, fmtVec(mid));
    this.setText(out.polar, fmtVec(tip));
    this.setText(out.rotate, fmtVec(rotated));
  }
}
