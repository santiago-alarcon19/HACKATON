package com.tractorstore.shared.exception;

public class StoreNotFoundException extends BusinessException {

  public StoreNotFoundException(String storeId) {
    super("STORE_NOT_FOUND", "Store not found: " + storeId);
  }
}
