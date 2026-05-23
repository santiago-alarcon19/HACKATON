package com.tractorstore.catalog.internal.repository;

import com.tractorstore.catalog.internal.domain.CatalogStoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogStoreRepository extends JpaRepository<CatalogStoreEntity, String> {}
