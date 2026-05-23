import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsRevealDirective } from './ts-reveal.directive';

@Component({
  standalone: true,
  imports: [TsRevealDirective],
  template: `<section tsReveal>Reveal me</section>`,
})
class HostComponent {}

describe('TsRevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    class MockObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
      constructor(private cb: IntersectionObserverCallback) {
        cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }
    (global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('adds visible class when intersecting', () => {
    const el = fixture.nativeElement.querySelector('section');
    expect(el.classList.contains('ts-reveal--visible')).toBe(true);
  });
});
