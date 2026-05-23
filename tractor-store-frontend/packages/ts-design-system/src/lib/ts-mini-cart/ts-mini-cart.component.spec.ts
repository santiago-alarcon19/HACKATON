import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsMiniCartComponent } from './ts-mini-cart.component';

describe('TsMiniCartComponent', () => {
  let fixture: ComponentFixture<TsMiniCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsMiniCartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TsMiniCartComponent);
  });

  it('shows empty state and singular label', () => {
    fixture.componentInstance.itemCount = 1;
    fixture.detectChanges();
    expect(fixture.componentInstance.itemLabel).toBe('item');
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty');
  });

  it('computes extraCount and emits checkout', () => {
    fixture.componentInstance.itemCount = 5;
    fixture.componentInstance.lines = [
      { sku: 'A', name: 'A', quantity: 2 },
      { sku: 'B', name: 'B', quantity: 1 },
    ];
    fixture.detectChanges();
    expect(fixture.componentInstance.extraCount).toBe(2);

    const checkout = jest.fn();
    fixture.componentInstance.checkout.subscribe(checkout);
    fixture.nativeElement.querySelector('.mini__checkout').click();
    expect(checkout).toHaveBeenCalled();
  });
});
