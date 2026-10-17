import { contrastRatio, darken, hexToRgb, lighten, mixColor, rgbToHex, rgbToHsl } from '@ashwinthomas/utils/color';
import { Component } from '../core/Component.js';
import { RangeField } from '../components/RangeField.js';
import { fmt } from '../core/format.js';

// WCAG 2 contrast minimums.
const LEVELS = [
  ['AA', 4.5],
  ['AA large', 3],
  ['AAA', 7],
];

/** Two colors: a as text on b, their mix at t, a lightness ramp of a, and contrast. */
export class ColorDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.a = this.ref('a');
    this.b = this.ref('b');
    this.t = new RangeField(this.ref('t'), this.ref('t-out'), () => this.render());
    this.els = {
      aOut: this.ref('a-out'),
      bOut: this.ref('b-out'),
      bg: this.ref('preview-bg'),
      fg: this.ref('preview-fg'),
      marker: this.ref('marker'),
    };
    this.mix = this.$$('[data-mix]');
    this.ramp = this.$$('[data-ramp]');
    this.outputs = Object.fromEntries(this.$$('[data-out]').map((el) => [el.dataset.out, el]));
    // Strip geometry and step count come from the SVG markup.
    const strip = this.ref('mix-strip');
    this.stripX = +strip.getAttribute('x');
    this.stripW = +strip.getAttribute('width');
    this.mixSteps = this.mix.length - 1;

    this.on(this.a, 'input', () => this.render());
    this.on(this.b, 'input', () => this.render());
    this.render();
  }

  render() {
    const a = hexToRgb(this.a.value);
    const b = hexToRgb(this.b.value);
    const t = this.t.value;
    const hexA = rgbToHex(a);
    const hexB = rgbToHex(b);
    const mixed = rgbToHex(mixColor(a, b, t));
    const ratio = contrastRatio(a, b);
    const hsl = rgbToHsl(a);
    const { aOut, bOut, bg, fg, marker } = this.els;
    const out = this.outputs;

    this.setText(aOut, hexA);
    this.setText(bOut, hexB);
    this.setAttrs(bg, { fill: hexB });
    this.setAttrs(fg, { fill: hexA });
    this.mix.forEach((rect) => {
      this.setAttrs(rect, { fill: rgbToHex(mixColor(a, b, +rect.dataset.mix / this.mixSteps)) });
    });
    this.setAttrs(marker, { cx: (this.stripX + t * this.stripW).toFixed(1), fill: mixed });
    this.ramp.forEach((rect) => {
      const k = +rect.dataset.ramp;
      this.setAttrs(rect, { fill: rgbToHex(k < 0 ? darken(a, -k) : lighten(a, k)) });
    });

    const levels = LEVELS.map(([name, min]) => `${name} ${ratio >= min ? 'pass' : 'fail'}`).join(' · ');
    this.setText(out.ratio, `${fmt(ratio, 2)}:1 · ${levels}`);
    this.setText(out.rgb, `{ r: ${a.r}, g: ${a.g}, b: ${a.b} }`);
    this.setText(out.hsl, `{ h: ${fmt(hsl.h, 1)}, s: ${fmt(hsl.s, 2)}, l: ${fmt(hsl.l, 2)} }`);
    this.setText(out.mix, mixed);
  }
}
