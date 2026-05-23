package com.tractorstore.cart.api.dto;

import java.util.List;

public record CartResponse(List<LineItemDto> items, int total) {}
