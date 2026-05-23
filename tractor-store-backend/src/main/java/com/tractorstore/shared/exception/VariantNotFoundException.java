package com.tractorstore.shared.exception;

public class VariantNotFoundException extends BusinessException {

  public VariantNotFoundException(String sku) {
    super("VARIANT_NOT_FOUND", "Variant not found: " + sku);
  }
}
