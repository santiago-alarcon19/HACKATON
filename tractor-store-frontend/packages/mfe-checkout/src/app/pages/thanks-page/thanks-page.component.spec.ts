import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrdersApiService } from '@tractor-store/shared-catalog';
import { ThanksPageComponent } from './thanks-page.component';

describe('ThanksPageComponent', () => {
  let fixture: ComponentFixture<ThanksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThanksPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'ord-1' } },
          },
        },
        {
          provide: OrdersApiService,
          useValue: {
            getOrder: jest.fn().mockReturnValue(
              of({
                id: 'ord-1',
                firstname: 'Ada',
                lastname: 'Lovelace',
                storeId: 'store-a',
                status: 'CONFIRMED',
                total: 100,
                currency: 'USD',
                createdAt: new Date().toISOString(),
                items: [],
              })
            ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThanksPageComponent);
    fixture.detectChanges();
  });

  it('shows buyer name from loaded order', () => {
    expect(fixture.componentInstance.buyerName()).toBe('Ada Lovelace');
  });
});
