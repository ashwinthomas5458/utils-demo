import { range, rangeFloor, withSeed } from '@ashwinthomas/utils/random';
import { Component } from '../core/Component.js';
import { fmt } from '../core/format.js';

/**
 * Histogram of rangeFloor(10) samples that flattens as the count grows.
 * With a seed, samples come from withSeed(seed), and Reset replays the exact
 * same sequence.
 */
export class RandomDemo extends Component {
  constructor(root, ticker) {
    super(root, ticker);
    this.bars = this.$$('.a-hist li').map((li) => ({ li, count: li.querySelector('.a-hist-count') }));
    this.seedInput = this.ref('seed');
    this.els = {
      samples: this.ref('samples'),
      source: this.ref('source'),
      seedOut: this.ref('seed-out'),
      rangeCall: this.ref('range-call'),
      dieCall: this.ref('die-call'),
      lastRange: this.ref('last-range'),
      lastDie: this.ref('last-die'),
    };
    this.reset();

    this.$$('[data-roll]').forEach((button) => {
      this.on(button, 'click', () => this.roll(+button.dataset.roll));
    });
    this.on(this.ref('reset'), 'click', () => this.reset());
    this.on(this.seedInput, 'input', () => this.reset());
  }

  roll(k) {
    const rng = this.rng;
    for (let i = 0; i < k; i++) this.counts[rng ? rng.rangeFloor(10) : rangeFloor(10)]++;
    this.samples += k;
    this.lastRange = fmt(rng ? rng.range(-1, 1) : range(-1, 1), 4);
    this.lastDie = String(rng ? rng.rangeFloor(1, 7) : rangeFloor(1, 7));
    this.render();
  }

  /** Clears the histogram and, when seeded, restarts the generator from its seed. */
  reset() {
    this.seed = this.seedInput.value.trim();
    this.rng = this.seed ? withSeed(this.seed) : null;
    this.counts = new Array(this.bars.length).fill(0);
    this.samples = 0;
    this.lastRange = '—';
    this.lastDie = '—';
    this.render();
  }

  render() {
    const max = Math.max(1, ...this.counts);
    this.bars.forEach(({ li, count }, i) => {
      li.style.setProperty('--h', ((this.counts[i] / max) * 88).toFixed(2));
      this.setText(count, this.counts[i]);
    });
    const prefix = this.rng ? 'rng.' : '';
    const quoted = `'${this.seed.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    this.setText(this.els.samples, this.samples);
    this.setText(this.els.source, this.rng ? `rng = withSeed(${quoted})` : 'Math.random');
    this.setText(this.els.seedOut, this.rng ? `rng.seed ${this.rng.seed}` : 'unseeded');
    this.setText(this.els.rangeCall, `${prefix}range(-1, 1)`);
    this.setText(this.els.dieCall, `${prefix}rangeFloor(1, 7)`);
    this.setText(this.els.lastRange, this.lastRange);
    this.setText(this.els.lastDie, this.lastDie);
  }
}
