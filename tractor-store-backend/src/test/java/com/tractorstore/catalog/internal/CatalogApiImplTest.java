package com.tractorstore.catalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.tractorstore.catalog.internal.domain.CatalogStoreEntity;
import com.tractorstore.catalog.internal.repository.CatalogStoreRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CatalogApiImplTest {

  @Mock CatalogService catalogService;
  @Mock CatalogStoreRepository storeRepository;

  @InjectMocks CatalogApiImpl catalogApi;

  @Test
  void findStoreMapsEntityWhenPresent() {
    CatalogStoreEntity store = mock(CatalogStoreEntity.class);
    when(store.getId()).thenReturn("store-a");
    when(store.getName()).thenReturn("North");
    when(store.getStreet()).thenReturn("1 Field Rd");
    when(store.getCity()).thenReturn("Agri");
    when(store.getImage()).thenReturn("/store.jpg");
    when(storeRepository.findById("store-a")).thenReturn(Optional.of(store));

    assertThat(catalogApi.findStore("store-a")).isPresent();
    assertThat(catalogApi.findStore("store-a").get().id()).isEqualTo("store-a");
  }

  @Test
  void findStoreIsEmptyWhenMissing() {
    when(storeRepository.findById("missing")).thenReturn(Optional.empty());

    assertThat(catalogApi.findStore("missing")).isEmpty();
  }
}
