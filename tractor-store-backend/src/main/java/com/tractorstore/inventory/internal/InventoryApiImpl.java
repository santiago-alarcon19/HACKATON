package com.tractorstore.inventory.internal;

import com.tractorstore.inventory.api.InventoryApi;
import org.springframework.stereotype.Service;

@Service
public class InventoryApiImpl implements InventoryApi {

  private final InventoryService inventoryService;

  public InventoryApiImpl(InventoryService inventoryService) {
    this.inventoryService = inventoryService;
  }

  @Override
  public int available(String sku) {
    return inventoryService.available(sku);
  }

  @Override
  public void reserve(String sku, int quantity) {
    inventoryService.reserve(sku, quantity);
  }

  @Override
  public void release(String sku, int quantity) {
    inventoryService.release(sku, quantity);
  }
}
