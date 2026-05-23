package com.tractorstore.catalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.tractorstore.catalog.api.dto.ProductDetailDto;
import com.tractorstore.catalog.api.dto.ProductSummaryDto;
import com.tractorstore.catalog.internal.domain.CatalogProductEntity;
import com.tractorstore.catalog.internal.domain.CatalogVariantEntity;
import java.util.List;
import org.junit.jupiter.api.Test;

class CatalogMapperTest {

  @Test
  void toDetailMapsVariantsAndHighlights() {
    CatalogProductEntity product = mock(CatalogProductEntity.class);
    CatalogVariantEntity variant = mock(CatalogVariantEntity.class);

    when(product.getName()).thenReturn("Autonomous Pro");
    when(product.getId()).thenReturn("AU-02");
    when(product.getCategory()).thenReturn("autonomous");
    when(product.getHighlights()).thenReturn(new String[] {"GPS", "Solar"});
    when(product.getVariants()).thenReturn(List.of(variant));
    when(variant.getName()).thenReturn("Sunset Copper");
    when(variant.getImage()).thenReturn("/img.jpg");
    when(variant.getSku()).thenReturn("AU-02-OG");
    when(variant.getColor()).thenReturn("#dd5219");
    when(variant.getPrice()).thenReturn(4100);

    ProductDetailDto detail = CatalogMapper.toDetail(product);

    assertThat(detail.id()).isEqualTo("AU-02");
    assertThat(detail.variants()).hasSize(1);
    assertThat(detail.highlights()).containsExactly("GPS", "Solar");
  }

  @Test
  void toSummaryUsesCheapestVariant() {
    CatalogProductEntity product = mock(CatalogProductEntity.class);
    CatalogVariantEntity expensive = mock(CatalogVariantEntity.class);
    CatalogVariantEntity cheap = mock(CatalogVariantEntity.class);

    when(product.getName()).thenReturn("Classic");
    when(product.getId()).thenReturn("CL-01");
    when(product.getVariants()).thenReturn(List.of(expensive, cheap));
    when(expensive.getPrice()).thenReturn(9000);
    when(expensive.getImage()).thenReturn("/expensive.jpg");
    when(cheap.getPrice()).thenReturn(5700);
    when(cheap.getImage()).thenReturn("/cheap.jpg");

    ProductSummaryDto summary = CatalogMapper.toSummary(product);

    assertThat(summary.startPrice()).isEqualTo(5700);
    assertThat(summary.image()).isEqualTo("/cheap.jpg");
    assertThat(summary.url()).isEqualTo("/product/CL-01");
  }
}
