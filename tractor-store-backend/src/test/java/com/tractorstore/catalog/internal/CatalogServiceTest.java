package com.tractorstore.catalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.tractorstore.catalog.api.dto.VariantDto;
import com.tractorstore.catalog.internal.domain.CatalogProductEntity;
import com.tractorstore.catalog.internal.domain.CatalogStoreEntity;
import com.tractorstore.catalog.internal.domain.CatalogTeaserEntity;
import com.tractorstore.catalog.internal.domain.CatalogVariantEntity;
import com.tractorstore.catalog.internal.repository.CatalogProductRepository;
import com.tractorstore.catalog.internal.repository.CatalogStoreRepository;
import com.tractorstore.catalog.internal.repository.CatalogTeaserRepository;
import com.tractorstore.catalog.internal.repository.CatalogVariantRepository;
import com.tractorstore.shared.exception.ProductNotFoundException;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CatalogServiceTest {

  @Mock CatalogTeaserRepository teaserRepository;
  @Mock CatalogProductRepository productRepository;
  @Mock CatalogVariantRepository variantRepository;
  @Mock CatalogStoreRepository storeRepository;

  @InjectMocks CatalogService catalogService;

  @Test
  void getHomeMapsTeasers() {
    CatalogTeaserEntity teaser = mock(CatalogTeaserEntity.class);
    when(teaser.getTitle()).thenReturn("Classics");
    when(teaser.getImage()).thenReturn("/classic.jpg");
    when(teaser.getUrl()).thenReturn("/categories/classic");
    when(teaserRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of(teaser));

    assertThat(catalogService.getHome().teaser()).hasSize(1);
  }

  @Test
  void getCategoryThrowsForUnknownFilter() {
    assertThatThrownBy(() -> catalogService.getCategory("unknown"))
        .isInstanceOf(ProductNotFoundException.class);
  }

  @Test
  void getCategoryReturnsProductsForKnownFilter() {
    CatalogProductEntity product = mock(CatalogProductEntity.class);
    CatalogVariantEntity variant = variant("CL-01-GR", "CL-01", "#6B8E23", "Classic", 5700);
    when(product.getId()).thenReturn("CL-01");
    when(product.getName()).thenReturn("Classic");
    when(product.getVariants()).thenReturn(List.of(variant));
    when(productRepository.findByCategoryOrderByNameAsc("classic")).thenReturn(List.of(product));

    var category = catalogService.getCategory("classic");

    assertThat(category.key()).isEqualTo("classic");
    assertThat(category.products()).hasSize(1);
  }

  @Test
  void getProductMapsEntityWhenPresent() {
    CatalogProductEntity product = mock(CatalogProductEntity.class);
    CatalogVariantEntity variant = variant("CL-01-GR", "CL-01", "#6B8E23", "Classic", 5700);
    when(product.getId()).thenReturn("CL-01");
    when(product.getName()).thenReturn("Classic");
    when(product.getCategory()).thenReturn("classic");
    when(product.getHighlights()).thenReturn(new String[] {"Durable"});
    when(product.getVariants()).thenReturn(List.of(variant));
    when(productRepository.findWithVariantsById("CL-01")).thenReturn(Optional.of(product));

    assertThat(catalogService.getProduct("CL-01").id()).isEqualTo("CL-01");
  }

  @Test
  void getProductThrowsWhenMissing() {
    when(productRepository.findWithVariantsById("missing")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> catalogService.getProduct("missing"))
        .isInstanceOf(ProductNotFoundException.class);
  }

  @Test
  void getRecommendationsReturnsEmptyWhenSkusUnknown() {
    when(variantRepository.findBySkuIn(List.of("UNKNOWN"))).thenReturn(List.of());

    assertThat(catalogService.getRecommendations(List.of("UNKNOWN")).products()).isEmpty();
  }

  @Test
  void getRecommendationsReturnsEmptyForBlankInput() {
    assertThat(catalogService.getRecommendations(null).products()).isEmpty();
    assertThat(catalogService.getRecommendations(List.of()).products()).isEmpty();
  }

  @Test
  void getRecommendationsReturnsSimilarProducts() {
    CatalogVariantEntity selected = variant("AU-02-OG", "AU-02", "#dd5219", "Auto", 4100);
    CatalogVariantEntity candidate = variant("CL-01-GR", "CL-01", "#6B8E23", "Classic", 5700);
    when(candidate.getProduct().getVariants()).thenReturn(List.of(candidate));

    when(variantRepository.findBySkuIn(List.of("AU-02-OG"))).thenReturn(List.of(selected));
    when(variantRepository.findAll()).thenReturn(List.of(selected, candidate));

    assertThat(catalogService.getRecommendations(List.of("AU-02-OG")).products()).isNotEmpty();
  }

  @Test
  void findVariantMapsEntity() {
    CatalogVariantEntity entity = variant("AU-02-OG", "AU-02", "#dd5219", "Sunset", 4100);
    when(variantRepository.findWithProductBySku("AU-02-OG")).thenReturn(Optional.of(entity));

    Optional<VariantDto> variant = catalogService.findVariant("AU-02-OG");

    assertThat(variant).isPresent();
    assertThat(variant.get().sku()).isEqualTo("AU-02-OG");
  }

  @Test
  void storeExistsDelegatesToRepository() {
    when(storeRepository.existsById("store-a")).thenReturn(true);

    assertThat(catalogService.storeExists("store-a")).isTrue();
  }

  @Test
  void getStoresMapsAllStores() {
    CatalogStoreEntity store = mock(CatalogStoreEntity.class);
    when(store.getId()).thenReturn("store-a");
    when(store.getName()).thenReturn("North");
    when(store.getStreet()).thenReturn("1 Field Rd");
    when(store.getCity()).thenReturn("Agri");
    when(store.getImage()).thenReturn("/store.jpg");
    when(storeRepository.findAll()).thenReturn(List.of(store));

    assertThat(catalogService.getStores()).hasSize(1);
  }

  private static CatalogVariantEntity variant(
      String sku, String productId, String color, String name, int price) {
    CatalogVariantEntity variant = mock(CatalogVariantEntity.class);
    CatalogProductEntity product = mock(CatalogProductEntity.class);
    when(variant.getSku()).thenReturn(sku);
    when(variant.getColor()).thenReturn(color);
    when(variant.getProduct()).thenReturn(product);
    when(product.getId()).thenReturn(productId);
    when(product.getName()).thenReturn(name);
    when(product.getVariants()).thenReturn(List.of(variant));
    when(variant.getName()).thenReturn(name);
    when(variant.getImage()).thenReturn("/img.jpg");
    when(variant.getPrice()).thenReturn(price);
    return variant;
  }
}
