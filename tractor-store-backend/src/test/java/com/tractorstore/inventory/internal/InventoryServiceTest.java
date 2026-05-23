package com.tractorstore.inventory.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tractorstore.inventory.internal.domain.InventoryStockEntity;
import com.tractorstore.inventory.internal.repository.InventoryStockRepository;
import com.tractorstore.shared.exception.OutOfStockException;
import com.tractorstore.shared.exception.VariantNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

  @Mock InventoryStockRepository stockRepository;

  @InjectMocks InventoryService inventoryService;

  @Test
  void getStockReturnsQuantity() {
    InventoryStockEntity stock = new InventoryStockEntity("SKU-1", 10);
    when(stockRepository.findById("SKU-1")).thenReturn(Optional.of(stock));

    assertThat(inventoryService.getStock("SKU-1").quantity()).isEqualTo(10);
  }

  @Test
  void getStockThrowsWhenSkuMissing() {
    when(stockRepository.findById(anyString())).thenReturn(Optional.empty());

    assertThatThrownBy(() -> inventoryService.getStock("MISSING"))
        .isInstanceOf(VariantNotFoundException.class);
  }

  @Test
  void availableReturnsZeroWhenSkuMissing() {
    when(stockRepository.findById("MISSING")).thenReturn(Optional.empty());

    assertThat(inventoryService.available("MISSING")).isZero();
  }

  @Test
  void reserveDecrementsStock() {
    InventoryStockEntity stock = new InventoryStockEntity("SKU-1", 5);
    when(stockRepository.findForUpdate("SKU-1")).thenReturn(Optional.of(stock));

    inventoryService.reserve("SKU-1", 2);

    assertThat(stock.getQuantity()).isEqualTo(3);
  }

  @Test
  void reserveThrowsWhenInsufficientStock() {
    InventoryStockEntity stock = new InventoryStockEntity("SKU-1", 1);
    when(stockRepository.findForUpdate("SKU-1")).thenReturn(Optional.of(stock));

    assertThatThrownBy(() -> inventoryService.reserve("SKU-1", 2))
        .isInstanceOf(OutOfStockException.class);
  }

  @Test
  void reserveThrowsWhenSkuMissing() {
    when(stockRepository.findForUpdate("MISSING")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> inventoryService.reserve("MISSING", 1))
        .isInstanceOf(VariantNotFoundException.class);
  }

  @Test
  void releaseIncrementsStockWhenPresent() {
    InventoryStockEntity stock = new InventoryStockEntity("SKU-1", 3);
    when(stockRepository.findForUpdate("SKU-1")).thenReturn(Optional.of(stock));

    inventoryService.release("SKU-1", 2);

    assertThat(stock.getQuantity()).isEqualTo(5);
    verify(stockRepository).findForUpdate("SKU-1");
  }

  @Test
  void releaseIsNoOpWhenSkuMissing() {
    when(stockRepository.findForUpdate("MISSING")).thenReturn(Optional.empty());

    inventoryService.release("MISSING", 5);
  }
}
