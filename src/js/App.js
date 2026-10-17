import { Ticker } from './core/Ticker.js';
import { CopyButton } from './components/CopyButton.js';
import { SectionNav } from './components/SectionNav.js';
import { HeroDemo } from './demos/HeroDemo.js';
import { InterpolateDemo } from './demos/InterpolateDemo.js';
import { MathGridDemo } from './demos/MathGridDemo.js';
import { RandomDemo } from './demos/RandomDemo.js';
import { DampDemo } from './demos/DampDemo.js';
import { SmoothstepDemo } from './demos/SmoothstepDemo.js';
import { EasingDemo } from './demos/EasingDemo.js';
import { AngleDemo } from './demos/AngleDemo.js';
import { VectorDemo } from './demos/VectorDemo.js';
import { GeometryDemo } from './demos/GeometryDemo.js';
import { ColorDemo } from './demos/ColorDemo.js';

// Maps each element's data-demo attribute to the class that drives it.
const DEMOS = {
  hero: HeroDemo,
  interpolate: InterpolateDemo,
  'math-grid': MathGridDemo,
  random: RandomDemo,
  damp: DampDemo,
  smoothstep: SmoothstepDemo,
  easing: EasingDemo,
  angle: AngleDemo,
  vector: VectorDemo,
  geometry: GeometryDemo,
  color: ColorDemo,
};

export class App {
  constructor(doc = document) {
    this.ticker = new Ticker();
    this.components = [];

    doc.querySelectorAll('[data-demo]').forEach((root) => {
      const Demo = DEMOS[root.dataset.demo];
      if (!Demo) return;
      // One broken demo must not take the rest of the page down with it.
      try {
        this.components.push(new Demo(root, this.ticker));
      } catch (error) {
        console.error(`[utils-playground] ${root.dataset.demo} failed to start`, error);
      }
    });

    doc.querySelectorAll('[data-copy]').forEach((button) => new CopyButton(button));
    doc.querySelectorAll('[data-section-nav]').forEach((nav) => new SectionNav(nav));
  }

  destroy() {
    this.components.forEach((c) => c.destroy());
    this.components = [];
  }
}
