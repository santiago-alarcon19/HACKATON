package com.tractorstore.catalog.api;

import com.tractorstore.catalog.api.dto.CategoryResponse;
import com.tractorstore.catalog.api.dto.HomeResponse;
import com.tractorstore.catalog.api.dto.ProductDetailDto;
import com.tractorstore.catalog.api.dto.RecommendationsResponse;
import com.tractorstore.catalog.api.dto.StoreDto;
import com.tractorstore.catalog.internal.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

  private final CatalogService catalogService;

  public CatalogController(CatalogService catalogService) {
    this.catalogService = catalogService;
  }

  @GetMapping("/home")
  @Operation(summary = "Home teasers for featured categories")
  public HomeResponse home() {
    return catalogService.getHome();
  }

  @GetMapping("/categories/{filter}")
  @Operation(summary = "Products for a category filter (classic or autonomous)")
  public CategoryResponse category(@PathVariable String filter) {
    return catalogService.getCategory(filter);
  }

  @GetMapping("/products/{id}")
  @Operation(summary = "Product detail with variants")
  public ProductDetailDto product(@PathVariable String id) {
    return catalogService.getProduct(id);
  }

  @GetMapping("/recommendations")
  @Operation(summary = "Color-based recommendations for comma-separated SKUs")
  public RecommendationsResponse recommendations(@RequestParam(required = false) String skus) {
    List<String> skuList =
        skus == null || skus.isBlank()
            ? List.of()
            : Arrays.stream(skus.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    return catalogService.getRecommendations(skuList);
  }

  @GetMapping("/stores")
  @Operation(summary = "Physical store locations")
  public List<StoreDto> stores() {
    return catalogService.getStores();
  }
}
