import {
  mapCategoryResponse,
  mapHomeResponse,
  mapProductDetailResponse,
  mapProductSummary,
  mapRecommendations,
  mapStockDto,
  mapStoreDto,
  resolveImageUrl,
} from './catalog-api.mapper';

describe('catalog-api.mapper', () => {
  it('resolveImageUrl uses placeholder when path missing', () => {
    expect(resolveImageUrl()).toContain('placehold.co');
  });

  it('resolveImageUrl keeps absolute urls', () => {
    expect(resolveImageUrl('https://example.com/x.jpg')).toBe(
      'https://example.com/x.jpg'
    );
  });

  it('resolveImageUrl builds cdn url with scene size', () => {
    expect(resolveImageUrl('/cdn/img/scene/[size]/classic.webp')).toContain(
      '/scene/500/'
    );
  });

  it('mapHomeResponse builds hero and categories from teasers', () => {
    const payload = mapHomeResponse({
      teaser: [
        {
          title: 'Classics',
          image: '/cdn/img/scene/[size]/classic.webp',
          url: '/products/classic',
        },
        {
          title: 'Autonomous line',
          image: '/cdn/img/scene/[size]/auto.webp',
          url: '/products/autonomous',
        },
      ],
    });

    expect(payload.hero.title).toBe('Classics');
    expect(payload.categories).toHaveLength(2);
    expect(payload.categories[0].filter).toBe('classic');
    expect(payload.categories[1].filter).toBe('autonomous');
  });

  it('mapCategoryResponse maps products', () => {
    const group = mapCategoryResponse({
      key: 'classic',
      name: 'Classics',
      filters: ['classic', 'autonomous'],
      products: [
        {
          id: 'CL-01',
          name: 'Classic One',
          image: '/img.jpg',
          startPrice: 1000,
          url: '/products/CL-01',
        },
      ],
    });

    expect(group.products[0].id).toBe('CL-01');
    expect(group.products[0].priceFrom).toBe(1000);
  });

  it('mapProductSummary lowercases slug', () => {
    const summary = mapProductSummary(
      {
        id: 'AU-02',
        name: 'Auto',
        image: '/img.jpg',
        startPrice: 2000,
        url: '/x',
      },
      'autonomous'
    );
    expect(summary.slug).toBe('au-02');
    expect(summary.category).toBe('autonomous');
  });

  it('mapProductDetailResponse maps variants and priceFrom', () => {
    const detail = mapProductDetailResponse({
      id: 'AU-02',
      name: 'Auto tractor',
      category: 'autonomous',
      highlights: ['GPS', '4WD'],
      variants: [
        {
          sku: 'AU-02-OG',
          name: 'Orange',
          image: '/v1.jpg',
          color: '#ff8800',
          price: 1500,
        },
        {
          sku: 'AU-02-BL',
          name: 'Blue',
          image: '/v2.jpg',
          color: '#0000ff',
          price: 1600,
        },
      ],
    });

    expect(detail.variants).toHaveLength(2);
    expect(detail.priceFrom).toBe(1500);
    expect(detail.images).toHaveLength(2);
  });

  it('mapStoreDto maps address fields', () => {
    const store = mapStoreDto({
      id: 'store-a',
      name: 'North',
      street: '1 Field Rd',
      city: 'Agri City',
      image: '/store.jpg',
    });
    expect(store.address).toBe('1 Field Rd');
    expect(store.imageUrl).toContain('blueprint.the-tractor.store');
  });

  it('mapStockDto maps inventory status', () => {
    expect(mapStockDto({ sku: 'X', quantity: 3 }).available).toBe(3);
  });

  it('mapRecommendations maps product list', () => {
    const recs = mapRecommendations([
      { id: 'A', name: 'A', image: '/a', startPrice: 1, url: '/a' },
    ]);
    expect(recs).toHaveLength(1);
  });
});
