import { fmt } from '../core/format.js';

/**
 * Wraps an <input type="range"> and the <output> that mirrors its value.
 * Reads its starting value from the markup.
 */
export class RangeField {
  constructor(input, output, onInput, digits = 2) {
    this.input = input;
    this.output = output;
    this.digits = digits;
    this.value = +input.value;

    input.addEventListener('input', () => {
      this.value = +input.value;
      this.render();
      onInput(this.value);
    });
  }

  render() {
    if (this.output) this.output.textContent = fmt(this.value, this.digits);
  }
}
