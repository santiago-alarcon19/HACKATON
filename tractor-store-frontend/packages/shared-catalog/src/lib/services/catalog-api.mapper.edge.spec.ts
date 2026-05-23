import {
  mapCategoryResponse,
  mapHomeResponse,
  mapProductDetailResponse,
  mapRecommendations,
  resolveImageUrl,
} from './catalog-api.mapper';

describe('catalog-api.mapper edge cases', () => {
  it('mapHomeResponse uses defaults when teasers missing', () => {
    const payload = mapHomeResponse({ teaser: [] });
    expect(payload.hero.title).toBe('Tractor Store');
    expect(payload.categories).toEqual([]);
  });

  it('mapCategoryResponse handles empty products', () => {
    const group = mapCategoryResponse({
      key: 'classic',
      name: 'Classics',
      filters: [],
      products: [],
    });
    expect(group.products).toEqual([]);
  });

  it('mapProductDetailResponse handles product without variants', () => {
    const detail = mapProductDetailResponse({
      id: 'X',
      name: 'Empty',
      category: 'classic',
      highlights: [],
      variants: [],
    });
    expect(detail.priceFrom).toBe(0);
    expect(detail.images).toHaveLength(1);
  });

  it('resolveImageUrl uses store size for store paths', () => {
    expect(resolveImageUrl('/cdn/img/store/[size]/north.jpg')).toContain('/store/400/');
  });

  it('mapRecommendations handles undefined input', () => {
    expect(mapRecommendations(undefined as unknown as [])).toEqual([]);
  });
});
