package com.tractorstore.inventory.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventoryApiImplTest {

  @Mock InventoryService inventoryService;

  @InjectMocks InventoryApiImpl inventoryApi;

  @Test
  void availableDelegatesToService() {
    when(inventoryService.available("AU-02-OG")).thenReturn(7);

    assertThat(inventoryApi.available("AU-02-OG")).isEqualTo(7);
  }

  @Test
  void reserveDelegatesToService() {
    inventoryApi.reserve("AU-02-OG", 2);

    verify(inventoryService).reserve("AU-02-OG", 2);
  }

  @Test
  void releaseDelegatesToService() {
    inventoryApi.release("AU-02-OG", 1);

    verify(inventoryService).release("AU-02-OG", 1);
  }
}
