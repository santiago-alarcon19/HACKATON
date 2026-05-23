package com.tractorstore.catalog.internal;

import com.tractorstore.catalog.api.dto.ProductDetailDto;
import com.tractorstore.catalog.api.dto.ProductSummaryDto;
import com.tractorstore.catalog.api.dto.StoreDto;
import com.tractorstore.catalog.api.dto.TeaserDto;
import com.tractorstore.catalog.api.dto.VariantDto;
import com.tractorstore.catalog.internal.domain.CatalogProductEntity;
import com.tractorstore.catalog.internal.domain.CatalogStoreEntity;
import com.tractorstore.catalog.internal.domain.CatalogTeaserEntity;
import com.tractorstore.catalog.internal.domain.CatalogVariantEntity;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

final class CatalogMapper {

  private CatalogMapper() {}

  static TeaserDto toTeaser(CatalogTeaserEntity entity) {
    return new TeaserDto(entity.getTitle(), entity.getImage(), entity.getUrl());
  }

  static StoreDto toStore(CatalogStoreEntity entity) {
    return new StoreDto(
        entity.getId(), entity.getName(), entity.getStreet(), entity.getCity(), entity.getImage());
  }

  static VariantDto toVariant(CatalogVariantEntity entity) {
    return new VariantDto(
        entity.getName(), entity.getImage(), entity.getSku(), entity.getColor(), entity.getPrice());
  }

  static ProductDetailDto toDetail(CatalogProductEntity product) {
    List<VariantDto> variants =
        product.getVariants().stream().map(CatalogMapper::toVariant).toList();
    return new ProductDetailDto(
        product.getName(),
        product.getId(),
        product.getCategory(),
        Arrays.asList(product.getHighlights()),
        variants);
  }

  static ProductSummaryDto toSummary(CatalogProductEntity product) {
    CatalogVariantEntity cheapest =
        product.getVariants().stream()
            .min(Comparator.comparingInt(CatalogVariantEntity::getPrice))
            .orElseThrow();
    return new ProductSummaryDto(
        product.getName(),
        product.getId(),
        cheapest.getImage(),
        cheapest.getPrice(),
        "/product/" + product.getId());
  }
}
