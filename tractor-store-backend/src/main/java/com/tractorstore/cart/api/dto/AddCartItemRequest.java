package com.tractorstore.cart.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AddCartItemRequest(@NotBlank String sku) {}
