import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CHECKOUT_CART_UPDATED } from '@tractor-store/shared-catalog';
import { TsCartCounterComponent } from './ts-cart-counter.component';

describe('TsCartCounterComponent', () => {
  let fixture: ComponentFixture<TsCartCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsCartCounterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TsCartCounterComponent);
    fixture.detectChanges();
  });

  it('updates count when checkout:cart-updated fires', () => {
    window.dispatchEvent(
      new CustomEvent(CHECKOUT_CART_UPDATED, {
        detail: { itemCount: 5, subtotal: 100 },
        composed: true,
      })
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.count).toBe(5);
  });
});
