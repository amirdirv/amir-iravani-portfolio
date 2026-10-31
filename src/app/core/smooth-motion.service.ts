import { DOCUMENT, Injectable, effect, inject } from '@angular/core';
import type Lenis from 'lenis';
import { CommandsService } from './commands.service';
import { prefersReducedMotion } from './motion';

type Gsap = typeof import('gsap').gsap;

/**
 * Smooth scrolling (Lenis) and scroll-linked motion (GSAP ScrollTrigger).
 *
 * Both libraries are loaded lazily after the first render, in the browser
 * only, so the prerendered HTML and the first paint never wait for them.
 * The app is zoneless, so the animation loop never triggers change detection.
 * Lenis honours `prefers-reduced-motion` on its own; the scrubbed effects
 * are skipped entirely for those visitors.
 */
@Injectable({ providedIn: 'root' })
export class SmoothMotionService {
  private readonly document = inject(DOCUMENT);
  private readonly commands = inject(CommandsService);

  private lenis?: Lenis;
  private started = false;

  constructor() {
    // Overlays (palette, terminal) scroll on their own: pause the page meanwhile.
    effect(() => {
      const overlay = this.commands.paletteOpen() || this.commands.terminalOpen();
      if (!this.lenis) return;
      if (overlay) this.lenis.stop();
      else this.lenis.start();
    });
  }

  /** True once Lenis drives the page scroll. */
  get active(): boolean {
    return !!this.lenis;
  }

  async start(): Promise<void> {
    const win = this.document.defaultView;
    // Real browsers only: test DOMs (jsdom) lack matchMedia, which GSAP needs.
    if (
      this.started ||
      !win ||
      typeof win.requestAnimationFrame !== 'function' ||
      typeof win.matchMedia !== 'function'
    )
      return;
    this.started = true;
    // Phones and tablets keep their native touch scrolling: they never download or run Lenis/GSAP.
    if (!win.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    // Wait until the page has loaded and the main thread is idle, so motion never delays the first paint.
    await new Promise<void>((resolve) => {
      const idle = (win as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      const go = () => (idle ? idle(() => resolve(), { timeout: 2000 }) : setTimeout(resolve, 300));
      if (this.document.readyState === 'complete') go();
      else win.addEventListener('load', go, { once: true });
    });

    const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new LenisCtor({
      lerp: 0.11,
      wheelMultiplier: 0.95,
      anchors: { offset: -this.navOffset() },
      stopInertiaOnNavigate: true,
    });
    this.lenis = lenis;
    // One loop for both: GSAP's ticker drives Lenis, Lenis feeds ScrollTrigger.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    if (!prefersReducedMotion()) this.scrollScenes(gsap);

    // Fonts and lazy images change heights after load: re-measure once settled.
    win.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    this.document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  /** Smooth jump to an element or the top. Returns false when Lenis is not running. */
  scrollTo(target: HTMLElement | 'top'): boolean {
    if (!this.lenis) return false;
    this.lenis.scrollTo(target === 'top' ? 0 : target, {
      offset: target === 'top' ? 0 : -this.navOffset(),
      duration: 1.1,
    });
    return true;
  }

  private navOffset(): number {
    const root = this.document.documentElement;
    const nav = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 68;
    return nav + 16;
  }

  /** Quiet, Apple-style depth: the hero recedes as the page moves over it. */
  private scrollScenes(gsap: Gsap): void {
    const hero = this.document.querySelector<HTMLElement>('.hero');
    if (hero) {
      const trigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
      const copy = hero.querySelector('.hero__copy');
      const visual = hero.querySelector('.hero__visual');
      if (copy)
        gsap.to(copy, { yPercent: -10, opacity: 0.35, ease: 'none', scrollTrigger: trigger });
      if (visual)
        gsap.to(visual, { yPercent: 8, scale: 0.94, ease: 'none', scrollTrigger: { ...trigger } });
    }

    // Generative covers drift a little inside their cards (parallax depth).
    // Scaled up slightly so the moving art never shows an empty edge.
    for (const cover of this.document.querySelectorAll<SVGElement>('.project__cover > svg')) {
      gsap.fromTo(
        cover,
        { yPercent: -4, scale: 1.1 },
        {
          yPercent: 4,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      );
    }

    // Screenshots settle from a slight zoom as they scroll in. The zoom is anchored
    // to the kept top corner, so the site's header and logo never get cropped.
    for (const shot of this.document.querySelectorAll<HTMLImageElement>('.project__cover > img')) {
      gsap.fromTo(
        shot,
        { scale: 1.07, transformOrigin: getComputedStyle(shot).objectPosition || 'top center' },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: shot, start: 'top bottom', end: 'center center', scrub: 0.8 },
        },
      );
    }
  }
}
