package com.tractorstore.inventory.internal;

import com.tractorstore.inventory.api.dto.StockDto;
import com.tractorstore.inventory.internal.domain.InventoryStockEntity;
import com.tractorstore.inventory.internal.repository.InventoryStockRepository;
import com.tractorstore.shared.exception.OutOfStockException;
import com.tractorstore.shared.exception.VariantNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {

  private final InventoryStockRepository stockRepository;

  public InventoryService(InventoryStockRepository stockRepository) {
    this.stockRepository = stockRepository;
  }

  @Transactional(readOnly = true)
  public StockDto getStock(String sku) {
    InventoryStockEntity stock =
        stockRepository.findById(sku).orElseThrow(() -> new VariantNotFoundException(sku));
    return new StockDto(stock.getSku(), stock.getQuantity());
  }

  public int available(String sku) {
    return stockRepository.findById(sku).map(InventoryStockEntity::getQuantity).orElse(0);
  }

  public void reserve(String sku, int quantity) {
    InventoryStockEntity stock =
        stockRepository
            .findForUpdate(sku)
            .orElseThrow(() -> new VariantNotFoundException(sku));
    if (stock.getQuantity() < quantity) {
      throw new OutOfStockException(sku);
    }
    stock.setQuantity(stock.getQuantity() - quantity);
  }

  public void release(String sku, int quantity) {
    stockRepository
        .findForUpdate(sku)
        .ifPresent(
            stock -> stock.setQuantity(stock.getQuantity() + quantity));
  }
}
