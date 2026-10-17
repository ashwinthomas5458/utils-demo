/** Copies `data-copy` to the clipboard and confirms in the button label. */
export class CopyButton {
  constructor(button, { resetAfter = 1400 } = {}) {
    this.button = button;
    this.label = button.textContent;
    this.status = button.parentElement.querySelector('[data-ref="status"]');
    this.resetAfter = resetAfter;
    this.timer = 0;
    button.addEventListener('click', () => this.copy());
  }

  async copy() {
    const text = this.button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      this.flash('Copied', 'Install command copied to clipboard');
    } catch {
      this.flash('Failed', 'Copy failed. Select the command and copy it manually.');
    }
  }

  flash(label, message) {
    this.button.textContent = label;
    if (this.status) this.status.textContent = message;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.button.textContent = this.label;
      if (this.status) this.status.textContent = '';
    }, this.resetAfter);
  }
}
