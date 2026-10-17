import { clamp } from '@ashwinthomas/utils/math';
import { Component } from './Component.js';

const KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

/**
 * Base for SVG pads with draggable points. Points are `[data-point]` groups
 * holding a <circle> (and optional <text> label); their starting positions
 * come from the markup. Drag with a pointer, or focus a point and use the
 * arrow keys (Shift for bigger steps). Subclasses implement render() and call
 * it at the end of their constructor.
 */
export class DragPad extends Component {
  constructor(root, ticker, { margin = 8, step = 4, bigStep = 20 } = {}) {
    super(root, ticker);
    this.pad = this.ref('pad');
    const [, , w, h] = this.pad.getAttribute('viewBox').split(/\s+/).map(Number);
    this.size = { w, h };
    this.margin = margin;
    this.step = step;
    this.bigStep = bigStep;
    this.handles = {};
    this.points = {};
    this.$$('[data-point]').forEach((g) => {
      const key = g.dataset.point;
      const circle = g.querySelector('circle');
      this.handles[key] = { g, circle, text: g.querySelector('text') };
      this.points[key] = { x: +circle.getAttribute('cx'), y: +circle.getAttribute('cy') };
    });
    this.outputs = Object.fromEntries(this.$$('[data-out]').map((el) => [el.dataset.out, el]));
    this.drag = null;

    this.on(this.pad, 'pointerdown', (e) => this.onDown(e));
    this.on(this.pad, 'pointermove', (e) => this.onMove(e));
    this.on(this.pad, 'pointerup', () => this.onUp());
    this.on(this.pad, 'pointercancel', () => this.onUp());
    this.on(this.pad, 'keydown', (e) => this.onKey(e));
  }

  /** Keeps a point inside the pad, `margin` units from every edge. */
  keepInside(p) {
    const { w, h } = this.size;
    const m = this.margin;
    return { x: clamp(p.x, m, w - m), y: clamp(p.y, m, h - m) };
  }

  toSvg(e) {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(this.pad.getScreenCTM().inverse());
    return this.keepInside(p);
  }

  onDown(e) {
    const g = e.target.closest('[data-point]');
    if (!g) return;
    e.preventDefault();
    this.pad.setPointerCapture(e.pointerId);
    this.drag = g.dataset.point;
    g.classList.add('a-is-dragging');
    g.focus({ preventScroll: true });
  }

  onMove(e) {
    if (!this.drag) return;
    this.points[this.drag] = this.toSvg(e);
    this.render();
  }

  onUp() {
    if (!this.drag) return;
    this.handles[this.drag].g.classList.remove('a-is-dragging');
    this.drag = null;
  }

  onKey(e) {
    const g = e.target.closest('[data-point]');
    if (!g || !(e.key in KEYS)) return;
    e.preventDefault();
    const [dx, dy] = KEYS[e.key];
    const step = e.shiftKey ? this.bigStep : this.step;
    const p = this.points[g.dataset.point];
    this.points[g.dataset.point] = this.keepInside({ x: p.x + dx * step, y: p.y + dy * step });
    this.render();
  }

  /** Moves each handle's circle and label to its point. */
  renderHandles() {
    for (const key in this.handles) {
      const { circle, text } = this.handles[key];
      const p = this.points[key];
      this.setAttrs(circle, { cx: p.x, cy: p.y });
      if (text) this.setAttrs(text, { x: p.x, y: p.y });
    }
  }

  render() {}
}
