package com.tractorstore.order.api.dto;

import java.util.List;

/** Command passed from Cart module to Order public API on checkout. */
public record CreateOrderCommand(
    String firstname, String lastname, String storeId, List<CreateOrderLineItem> items) {

  public record CreateOrderLineItem(
      String sku, String name, String image, int price, int quantity) {}
}
