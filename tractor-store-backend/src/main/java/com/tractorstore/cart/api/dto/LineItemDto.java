package com.tractorstore.cart.api.dto;

public record LineItemDto(
    String sku, String name, String image, int price, int quantity) {}
