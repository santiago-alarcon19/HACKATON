package com.tractorstore.shared.exception;

public class OrderNotFoundException extends BusinessException {

  public OrderNotFoundException(String orderId) {
    super("ORDER_NOT_FOUND", "Order not found: " + orderId);
  }
}
