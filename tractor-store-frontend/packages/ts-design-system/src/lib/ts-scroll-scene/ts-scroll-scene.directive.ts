import {
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

/** Parallax + scroll state for `.ts-scene` farm backgrounds. */
@Directive({
  selector: '[tsScrollScene]',
  standalone: true,
})
export class TsScrollSceneDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private raf = 0;
  private listener?: () => void;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.listener = () => this.scheduleUpdate();
      window.addEventListener('scroll', this.listener, { passive: true });
      this.scheduleUpdate();
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener('scroll', this.listener);
    }
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

  private scheduleUpdate(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    this.raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, y / max));
      const host = this.el.nativeElement;
      host.style.setProperty('--ts-scroll-y', `${y}px`);
      host.style.setProperty('--ts-scroll-progress', String(progress));
      host.classList.toggle('ts-scene--scrolled', y > 24);
      host.classList.toggle('ts-scene--deep-scroll', progress > 0.35);
    });
  }
}
