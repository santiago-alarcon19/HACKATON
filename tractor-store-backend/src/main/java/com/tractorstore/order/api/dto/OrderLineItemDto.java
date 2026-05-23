package com.tractorstore.order.api.dto;

public record OrderLineItemDto(
    String sku, String name, String image, int price, int quantity) {}
