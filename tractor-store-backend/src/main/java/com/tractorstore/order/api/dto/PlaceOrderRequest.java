package com.tractorstore.order.api.dto;

import jakarta.validation.constraints.NotBlank;

public record PlaceOrderRequest(
    @NotBlank String firstname, @NotBlank String lastname, @NotBlank String storeId) {}
