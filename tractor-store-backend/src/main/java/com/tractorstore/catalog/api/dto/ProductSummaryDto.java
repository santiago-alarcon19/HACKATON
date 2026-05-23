package com.tractorstore.catalog.api.dto;

public record ProductSummaryDto(
    String name, String id, String image, int startPrice, String url) {}
