/**
 * A row of toggle buttons where exactly one is pressed. The pressed state
 * lives in `aria-pressed`, which the CSS also uses for styling.
 */
export class PillGroup {
  constructor(root, onChange) {
    this.root = root;
    this.buttons = Array.from(root.querySelectorAll('button[data-value]'));
    const pressed = this.buttons.find((b) => b.getAttribute('aria-pressed') === 'true');
    this.value = (pressed || this.buttons[0]).dataset.value;

    root.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button || button.dataset.value === this.value) return;
      this.select(button.dataset.value);
      onChange(this.value);
    });
  }

  select(value) {
    this.value = value;
    this.buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === value)));
  }
}
