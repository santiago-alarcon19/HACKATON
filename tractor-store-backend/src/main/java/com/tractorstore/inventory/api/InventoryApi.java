package com.tractorstore.inventory.api;

/** Public inventory module API. */
public interface InventoryApi {

  int available(String sku);

  void reserve(String sku, int quantity);

  void release(String sku, int quantity);
}
