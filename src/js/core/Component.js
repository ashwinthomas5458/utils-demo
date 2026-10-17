/**
 * Base class for every interactive block. Holds the root element, resolves
 * `data-ref` children, and tracks listeners so `destroy()` can undo them.
 */
export class Component {
  constructor(root, ticker) {
    this.root = root;
    this.ticker = ticker;
    this.cleanups = [];
  }

  ref(name) {
    return this.root.querySelector(`[data-ref="${name}"]`);
  }

  $$(selector) {
    return Array.from(this.root.querySelectorAll(selector));
  }

  on(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this.cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  /** Sets text only when it changed, to avoid needless DOM writes per frame. */
  setText(el, value) {
    const text = String(value);
    if (el.textContent !== text) el.textContent = text;
  }

  setAttrs(el, attrs) {
    for (const name in attrs) {
      const value = String(attrs[name]);
      if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    }
  }

  /**
   * Runs `tick(dt, time)` on the shared ticker, but only while the root is
   * on screen. Returns nothing; cleanup happens in destroy().
   */
  animate(tick) {
    let active = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === active) return;
      active = entry.isIntersecting;
      if (active) this.ticker.add(tick);
      else this.ticker.remove(tick);
    });
    observer.observe(this.root);
    this.cleanups.push(() => {
      observer.disconnect();
      this.ticker.remove(tick);
    });
  }

  destroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
  }
}
