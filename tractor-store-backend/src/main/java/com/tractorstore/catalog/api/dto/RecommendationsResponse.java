package com.tractorstore.catalog.api.dto;

import java.util.List;

public record RecommendationsResponse(List<ProductSummaryDto> products) {}
