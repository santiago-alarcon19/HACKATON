import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsScrollSceneDirective } from './ts-scroll-scene.directive';

@Component({
  standalone: true,
  imports: [TsScrollSceneDirective],
  template: `<div tsScrollScene class="ts-scene">Scene</div>`,
})
class HostComponent {}

describe('TsScrollSceneDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates scroll css variables on init', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('.ts-scene');
    expect(el.style.getPropertyValue('--ts-scroll-progress')).toBeTruthy();
  });
});
