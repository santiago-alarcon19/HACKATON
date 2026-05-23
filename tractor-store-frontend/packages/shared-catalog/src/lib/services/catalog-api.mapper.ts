import {
  CategoryGroup,
  HomePayload,
  InventoryStatus,
  ProductDetail,
  ProductSummary,
  ProductVariant,
  StoreLocation,
} from '../models/product.model';

const CDN_BASE = 'https://blueprint.the-tractor.store';

function cdnSizeForPath(path: string): string {
  if (path.includes('/scene/')) {
    return '500';
  }
  if (path.includes('/store/')) {
    return '400';
  }
  return '400';
}

export function resolveImageUrl(path?: string): string {
  if (!path) {
    return 'https://placehold.co/800x500/145c3a/fff?text=Tractor+Store';
  }
  if (path.startsWith('http')) {
    return path;
  }
  const size = cdnSizeForPath(path);
  return `${CDN_BASE}${path.replace('[size]', size)}`;
}

interface ApiTeaser {
  title: string;
  image: string;
  url: string;
}

interface ApiHome {
  teaser: ApiTeaser[];
}

interface ApiProductSummary {
  name: string;
  id: string;
  image: string;
  startPrice: number;
  url: string;
}

interface ApiCategory {
  key: string;
  name: string;
  products: ApiProductSummary[];
  filters: string[];
}

interface ApiVariant {
  name: string;
  image: string;
  sku: string;
  color: string;
  price: number;
}

interface ApiProductDetail {
  name: string;
  id: string;
  category: string;
  highlights: string[];
  variants: ApiVariant[];
}

interface ApiStore {
  id: string;
  name: string;
  street: string;
  city: string;
  image?: string;
}

interface ApiStock {
  sku: string;
  quantity: number;
}

function filterFromTeaserUrl(url: string): string {
  const normalized = url.toLowerCase();
  if (normalized.includes('autonomous')) {
    return 'autonomous';
  }
  if (normalized.includes('classic')) {
    return 'classic';
  }
  const match = normalized.match(/\/products\/([a-z]+)/);
  if (match?.[1] === 'autonomous' || match?.[1] === 'classic') {
    return match[1];
  }
  return 'classic';
}

export function mapHomeResponse(api: ApiHome): HomePayload {
  const teasers = api.teaser ?? [];
  const primary = teasers[0];
  const secondary = teasers[1];

  return {
    hero: {
      title: primary?.title ?? 'Tractor Store',
      subtitle:
        secondary?.title ?? 'Premium tractors for every field',
      imageUrl: resolveImageUrl(primary?.image),
    },
    featured: [],
    categories: teasers.map((t) => ({
      filter: filterFromTeaserUrl(t.url ?? ''),
      title: t.title,
      imageUrl: resolveImageUrl(t.image),
    })),
  };
}

export function mapProductSummary(
  p: ApiProductSummary,
  category?: string
): ProductSummary {
  return {
    id: p.id,
    name: p.name,
    slug: p.id.toLowerCase(),
    imageUrl: resolveImageUrl(p.image),
    priceFrom: p.startPrice,
    category,
  };
}

export function mapCategoryResponse(api: ApiCategory): CategoryGroup {
  return {
    filter: api.key,
    title: api.name,
    products: (api.products ?? []).map((p) =>
      mapProductSummary(p, api.key)
    ),
  };
}

export function mapProductDetailResponse(api: ApiProductDetail): ProductDetail {
  const variants: ProductVariant[] = (api.variants ?? []).map((v) => ({
    sku: v.sku,
    label: v.name,
    price: v.price,
    imageUrl: resolveImageUrl(v.image),
    attributes: { color: v.color },
    inStock: true,
  }));

  const images =
    (api.variants ?? []).length > 0
      ? (api.variants ?? []).map((v) => resolveImageUrl(v.image))
      : [resolveImageUrl(undefined)];

  const priceFrom =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.price))
      : 0;

  return {
    id: api.id,
    name: api.name,
    slug: api.id.toLowerCase(),
    imageUrl: images[0],
    priceFrom,
    category: api.category,
    description: (api.highlights ?? []).join(' '),
    images,
    variants,
  };
}

export function mapStoreDto(s: ApiStore): StoreLocation {
  return {
    id: s.id,
    name: s.name,
    city: s.city,
    address: s.street,
    imageUrl: resolveImageUrl(s.image),
  };
}

export function mapStockDto(s: ApiStock): InventoryStatus {
  return {
    sku: s.sku,
    available: s.quantity,
  };
}

export function mapRecommendations(
  products: ApiProductSummary[]
): ProductSummary[] {
  return (products ?? []).map((p) => mapProductSummary(p));
}
