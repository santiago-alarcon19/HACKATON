package com.tractorstore.catalog.internal;

import com.tractorstore.catalog.api.dto.CategoryResponse;
import com.tractorstore.catalog.api.dto.HomeResponse;
import com.tractorstore.catalog.api.dto.ProductDetailDto;
import com.tractorstore.catalog.api.dto.ProductSummaryDto;
import com.tractorstore.catalog.api.dto.RecommendationsResponse;
import com.tractorstore.catalog.api.dto.StoreDto;
import com.tractorstore.catalog.api.dto.TeaserDto;
import com.tractorstore.catalog.internal.domain.CatalogProductEntity;
import com.tractorstore.catalog.internal.domain.CatalogVariantEntity;
import com.tractorstore.catalog.internal.repository.CatalogProductRepository;
import com.tractorstore.catalog.internal.repository.CatalogStoreRepository;
import com.tractorstore.catalog.internal.repository.CatalogTeaserRepository;
import com.tractorstore.catalog.internal.repository.CatalogVariantRepository;
import com.tractorstore.shared.exception.ProductNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

  private static final List<String> FILTERS = List.of("classic", "autonomous");
  private static final Map<String, String> CATEGORY_NAMES =
      Map.of("classic", "Classics", "autonomous", "Autonomous");

  private final CatalogTeaserRepository teaserRepository;
  private final CatalogProductRepository productRepository;
  private final CatalogVariantRepository variantRepository;
  private final CatalogStoreRepository storeRepository;

  public CatalogService(
      CatalogTeaserRepository teaserRepository,
      CatalogProductRepository productRepository,
      CatalogVariantRepository variantRepository,
      CatalogStoreRepository storeRepository) {
    this.teaserRepository = teaserRepository;
    this.productRepository = productRepository;
    this.variantRepository = variantRepository;
    this.storeRepository = storeRepository;
  }

  public HomeResponse getHome() {
    List<TeaserDto> teasers =
        teaserRepository.findAllByOrderBySortOrderAsc().stream().map(CatalogMapper::toTeaser).toList();
    return new HomeResponse(teasers);
  }

  public CategoryResponse getCategory(String filter) {
    String category = normalizeFilter(filter);
    List<ProductSummaryDto> products =
        productRepository.findByCategoryOrderByNameAsc(category).stream()
            .map(CatalogMapper::toSummary)
            .toList();
    return new CategoryResponse(
        category, CATEGORY_NAMES.getOrDefault(category, category), products, FILTERS);
  }

  public ProductDetailDto getProduct(String id) {
    CatalogProductEntity product =
        productRepository
            .findWithVariantsById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    return CatalogMapper.toDetail(product);
  }

  public RecommendationsResponse getRecommendations(List<String> skus) {
    if (skus == null || skus.isEmpty()) {
      return new RecommendationsResponse(List.of());
    }
    List<CatalogVariantEntity> selected =
        variantRepository.findBySkuIn(skus).stream()
            .filter(v -> skus.contains(v.getSku()))
            .toList();
    if (selected.isEmpty()) {
      return new RecommendationsResponse(List.of());
    }

    Set<String> selectedSkus = selected.stream().map(CatalogVariantEntity::getSku).collect(Collectors.toSet());
    Set<String> selectedProductIds =
        selected.stream().map(v -> v.getProduct().getId()).collect(Collectors.toSet());

    double[] avgColor = averageColor(selected);

    List<CatalogVariantEntity> candidates =
        variantRepository.findAll().stream()
            .filter(v -> !selectedSkus.contains(v.getSku()))
            .filter(v -> !selectedProductIds.contains(v.getProduct().getId()))
            .toList();

    Map<String, CatalogProductEntity> bestByProduct = new java.util.HashMap<>();
    Map<String, Double> bestDistance = new java.util.HashMap<>();

    for (CatalogVariantEntity candidate : candidates) {
      double distance = ColorDistance.between(candidate.getColor(), toHex(avgColor));
      String productId = candidate.getProduct().getId();
      Double current = bestDistance.get(productId);
      if (current == null || distance < current) {
        bestDistance.put(productId, distance);
        bestByProduct.put(productId, candidate.getProduct());
      }
    }

    List<ProductSummaryDto> recommendations =
        bestByProduct.values().stream()
            .sorted(Comparator.comparingDouble(p -> bestDistance.get(p.getId())))
            .limit(6)
            .map(CatalogMapper::toSummary)
            .toList();

    return new RecommendationsResponse(recommendations);
  }

  public List<StoreDto> getStores() {
    return storeRepository.findAll().stream().map(CatalogMapper::toStore).toList();
  }

  public boolean storeExists(String storeId) {
    return storeRepository.existsById(storeId);
  }

  public java.util.Optional<com.tractorstore.catalog.api.dto.VariantDto> findVariant(String sku) {
    return variantRepository
        .findWithProductBySku(sku)
        .map(CatalogMapper::toVariant);
  }

  private static String normalizeFilter(String filter) {
    String key = filter == null ? "" : filter.toLowerCase();
    if (!FILTERS.contains(key)) {
      throw new ProductNotFoundException("category:" + filter);
    }
    return key;
  }

  private static double[] averageColor(List<CatalogVariantEntity> variants) {
    double r = 0;
    double g = 0;
    double b = 0;
    for (CatalogVariantEntity variant : variants) {
      String hex = variant.getColor().startsWith("#") ? variant.getColor().substring(1) : variant.getColor();
      r += Integer.parseInt(hex.substring(0, 2), 16);
      g += Integer.parseInt(hex.substring(2, 4), 16);
      b += Integer.parseInt(hex.substring(4, 6), 16);
    }
    int count = variants.size();
    return new double[] {r / count, g / count, b / count};
  }

  private static String toHex(double[] rgb) {
    int r = (int) Math.round(rgb[0]);
    int g = (int) Math.round(rgb[1]);
    int b = (int) Math.round(rgb[2]);
    return String.format("#%02X%02X%02X", r, g, b);
  }
}
