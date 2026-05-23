package com.tractorstore.catalog.internal.repository;

import com.tractorstore.catalog.internal.domain.CatalogTeaserEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogTeaserRepository extends JpaRepository<CatalogTeaserEntity, Long> {

  List<CatalogTeaserEntity> findAllByOrderBySortOrderAsc();
}
