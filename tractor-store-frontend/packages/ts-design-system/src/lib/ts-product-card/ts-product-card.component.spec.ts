import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsProductCardComponent } from './ts-product-card.component';

describe('TsProductCardComponent', () => {
  let fixture: ComponentFixture<TsProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsProductCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TsProductCardComponent);
    fixture.componentInstance.name = 'Classic Tractor';
    fixture.componentInstance.imageUrl = 'https://example.com/t.jpg';
    fixture.componentInstance.priceFrom = 1200;
    fixture.detectChanges();
  });

  it('renders product info and emits select', () => {
    const select = jest.fn();
    fixture.componentInstance.select.subscribe(select);
    expect(fixture.nativeElement.textContent).toContain('Classic Tractor');
    fixture.nativeElement.querySelector('.card__cta').click();
    expect(select).toHaveBeenCalled();
  });
});
