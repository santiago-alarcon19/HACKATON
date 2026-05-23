package com.tractorstore.shared.exception;

public class OutOfStockException extends BusinessException {

  public OutOfStockException(String sku) {
    super("OUT_OF_STOCK", "Variant is out of stock: " + sku);
  }
}
