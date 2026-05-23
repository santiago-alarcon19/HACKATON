package com.tractorstore.catalog.api;

import com.tractorstore.catalog.api.dto.StoreDto;
import com.tractorstore.catalog.api.dto.VariantDto;
import java.util.Optional;

/** Public catalog module API for other modules. */
public interface CatalogApi {

  Optional<VariantDto> findVariant(String sku);

  boolean storeExists(String storeId);

  Optional<StoreDto> findStore(String storeId);
}
