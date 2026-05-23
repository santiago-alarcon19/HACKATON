import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { CatalogApiService } from '@tractor-store/shared-catalog';
import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
  let fixture: ComponentFixture<CategoriesComponent>;
  let catalog: jest.Mocked<Pick<CatalogApiService, 'getCategories'>>;
  let routerEvents: Subject<unknown>;
  let router: { events: Subject<unknown>; url: string };
  let routeMock: {
    snapshot: { paramMap: { get: jest.Mock } };
    firstChild: null;
  };

  beforeEach(async () => {
    routerEvents = new Subject();
    router = { events: routerEvents, url: '/categories/classic' };
    routeMock = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('classic') } },
      firstChild: null,
    };
    catalog = {
      getCategories: jest.fn().mockReturnValue(
        of({
          filter: 'classic',
          title: 'Classics',
          products: [
            {
              id: 'CL-01',
              name: 'Classic',
              slug: 'cl-01',
              imageUrl: '/x.jpg',
              priceFrom: 100,
            },
          ],
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: CatalogApiService, useValue: catalog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    fixture.detectChanges();
  });

  it('loads category group on init', () => {
    expect(fixture.componentInstance.group()?.title).toBe('Classics');
    expect(catalog.getCategories).toHaveBeenCalledWith('classic');
  });

  it('reloads when navigation ends with a new filter', () => {
    catalog.getCategories.mockClear();
    routeMock.snapshot.paramMap.get.mockReturnValue('autonomous');
    router.url = '/categories/autonomous';
    routerEvents.next(new NavigationEnd(1, '/categories/autonomous', '/categories/autonomous'));
    expect(catalog.getCategories).toHaveBeenCalledWith('autonomous');
  });

  it('falls back to URL segment when route param is missing', async () => {
    await TestBed.resetTestingModule();
    catalog.getCategories.mockReturnValue(
      of({ filter: 'autonomous', title: 'Auto', products: [] })
    );
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        {
          provide: Router,
          useValue: { events: new Subject(), url: '/categories/autonomous' },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            firstChild: null,
          },
        },
        { provide: CatalogApiService, useValue: catalog },
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(CategoriesComponent);
    localFixture.detectChanges();
    expect(catalog.getCategories).toHaveBeenCalledWith('autonomous');
  });

  it('opens product detail page', () => {
    let href = '';
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        set href(value: string) {
          href = value;
        },
        get href() {
          return href;
        },
      },
    });

    fixture.componentInstance.openProduct({
      id: 'AU-02',
      name: 'Auto',
      slug: 'au-02',
      imageUrl: '/img.jpg',
      priceFrom: 1000,
    });
    expect(href).toBe('/product/AU-02');
  });
});
