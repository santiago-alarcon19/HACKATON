package com.tractorstore.catalog.api.dto;

import java.util.List;

public record ProductDetailDto(
    String name,
    String id,
    String category,
    List<String> highlights,
    List<VariantDto> variants) {}
