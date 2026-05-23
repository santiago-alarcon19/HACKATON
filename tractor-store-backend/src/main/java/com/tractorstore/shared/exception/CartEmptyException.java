package com.tractorstore.shared.exception;

public class CartEmptyException extends BusinessException {

  public CartEmptyException() {
    super("CART_EMPTY", "Cannot checkout with an empty cart");
  }
}
