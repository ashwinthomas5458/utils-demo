/**
 * Marks the link for the section currently being read with
 * aria-current="location". Targets come from the links' hrefs, in DOM order;
 * a target is "reached" once its top passes `line` (a fraction of the
 * viewport height). Nothing is marked before the first target or after the
 * section that contains the last one.
 */
export class SectionNav {
  constructor(root, { line = 0.35 } = {}) {
    this.line = line;
    this.items = Array.from(root.querySelectorAll('a[href^="#"]'))
      .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
      .filter((item) => item.target);
    if (!this.items.length) return;

    const last = this.items[this.items.length - 1].target;
    this.end = last.closest('section') || last;
    this.current = null;
    this.frame = 0;

    const schedule = () => {
      if (!this.frame) this.frame = requestAnimationFrame(() => this.update());
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    this.update();
  }

  update() {
    this.frame = 0;
    const line = innerHeight * this.line;
    let active = null;
    if (this.end.getBoundingClientRect().bottom > line) {
      for (const item of this.items) {
        if (item.target.getBoundingClientRect().top <= line) active = item;
      }
    }
    if (active === this.current) return;
    if (this.current) this.current.link.removeAttribute('aria-current');
    if (active) active.link.setAttribute('aria-current', 'location');
    this.current = active;
  }
}
