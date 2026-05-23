import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import {
  API_ENV,
  CatalogApiService,
  defaultApiEnvironment,
  HomePayload,
  ProductSummary,
} from '@tractor-store/shared-catalog';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        CatalogApiService,
        { provide: API_ENV, useValue: defaultApiEnvironment },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
  });

  it('loads home payload on init', () => {
    const catalog = TestBed.inject(CatalogApiService);
    jest.spyOn(catalog, 'getHome').mockReturnValue(
      of({
        hero: { title: 'Hero', subtitle: 'Sub', imageUrl: '/hero.jpg' },
        featured: [],
        categories: [{ filter: 'classic', title: 'Classics', imageUrl: '/c.jpg' }],
      })
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.home()?.hero.title).toBe('Hero');
  });

  it('maps category helpers', () => {
    const cmp = fixture.componentInstance;
    expect(cmp.categoryBadge('autonomous')).toBe('Autonomous');
    expect(cmp.categoryBadge('classic')).toBe('Classic');
    expect(cmp.categoryDesc('autonomous')).toContain('GPS');
    expect(cmp.categoryDesc('classic')).toContain('workhorses');
  });

  it('falls back hero image on error', () => {
    const cmp = fixture.componentInstance;
    cmp.onHeroImageError({
      hero: { title: 'T', subtitle: 'S', imageUrl: '/hero.jpg' },
      featured: [{ id: 'CL-01', name: 'C', slug: 'cl-01', imageUrl: '/feat.jpg', priceFrom: 1 }],
      categories: [],
    });
    expect(cmp.heroImageUrl()).toBe('/feat.jpg');
  });

  it('navigates to product detail', () => {
    const cmp = fixture.componentInstance;
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
    cmp.openProduct({
      id: 'AU-02',
      name: 'Auto',
      slug: 'au-02',
      imageUrl: '/img.jpg',
      priceFrom: 1000,
    });
    expect(href).toBe('/product/AU-02');
  });
});
