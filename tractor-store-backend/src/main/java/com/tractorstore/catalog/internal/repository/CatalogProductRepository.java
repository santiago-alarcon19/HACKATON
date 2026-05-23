package com.tractorstore.catalog.internal.repository;

import com.tractorstore.catalog.internal.domain.CatalogProductEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogProductRepository extends JpaRepository<CatalogProductEntity, String> {

  List<CatalogProductEntity> findByCategoryOrderByNameAsc(String category);

  @EntityGraph(attributePaths = "variants")
  Optional<CatalogProductEntity> findWithVariantsById(String id);
}
