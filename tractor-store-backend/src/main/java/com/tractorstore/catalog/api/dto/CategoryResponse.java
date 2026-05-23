package com.tractorstore.catalog.api.dto;

import java.util.List;

public record CategoryResponse(
    String key, String name, List<ProductSummaryDto> products, List<String> filters) {}
