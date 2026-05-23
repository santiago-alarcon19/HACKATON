import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsButtonComponent } from './ts-button.component';

describe('TsButtonComponent', () => {
  let fixture: ComponentFixture<TsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TsButtonComponent);
    fixture.detectChanges();
  });

  it('renders primary button and emits click', () => {
    const clicked = jest.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.nativeElement.querySelector('button').click();
    expect(clicked).toHaveBeenCalled();
  });

  it('respects disabled state', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('applies secondary variant class', () => {
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ts-btn--secondary')).toBeTruthy();
  });
});
