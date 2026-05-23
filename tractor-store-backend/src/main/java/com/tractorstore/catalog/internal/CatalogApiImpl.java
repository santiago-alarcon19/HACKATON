package com.tractorstore.catalog.internal;

import com.tractorstore.catalog.api.CatalogApi;
import com.tractorstore.catalog.api.dto.StoreDto;
import com.tractorstore.catalog.api.dto.VariantDto;
import com.tractorstore.catalog.internal.repository.CatalogStoreRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class CatalogApiImpl implements CatalogApi {

  private final CatalogService catalogService;
  private final CatalogStoreRepository storeRepository;

  public CatalogApiImpl(CatalogService catalogService, CatalogStoreRepository storeRepository) {
    this.catalogService = catalogService;
    this.storeRepository = storeRepository;
  }

  @Override
  public Optional<VariantDto> findVariant(String sku) {
    return catalogService.findVariant(sku);
  }

  @Override
  public boolean storeExists(String storeId) {
    return catalogService.storeExists(storeId);
  }

  @Override
  public Optional<StoreDto> findStore(String storeId) {
    return storeRepository.findById(storeId).map(CatalogMapper::toStore);
  }
}
