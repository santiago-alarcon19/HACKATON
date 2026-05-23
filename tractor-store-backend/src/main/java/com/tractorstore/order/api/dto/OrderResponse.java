package com.tractorstore.order.api.dto;

import java.util.List;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    String firstname,
    String lastname,
    String storeId,
    int total,
    List<OrderLineItemDto> items) {}
