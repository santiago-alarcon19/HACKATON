package com.tractorstore.catalog.internal.repository;

import com.tractorstore.catalog.internal.domain.CatalogVariantEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogVariantRepository extends JpaRepository<CatalogVariantEntity, String> {

  @EntityGraph(attributePaths = "product")
  Optional<CatalogVariantEntity> findWithProductBySku(String sku);

  @EntityGraph(attributePaths = "product")
  List<CatalogVariantEntity> findBySkuIn(List<String> skus);
}
