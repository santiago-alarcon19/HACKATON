package com.tractorstore.catalog;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class CatalogIntegrationTest {

  @Container
  static PostgreSQLContainer<?> postgres =
      new PostgreSQLContainer<>("postgres:16-alpine")
          .withDatabaseName("tractorstore")
          .withUsername("tractor")
          .withPassword("tractor");

  @DynamicPropertySource
  static void datasourceProps(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired MockMvc mockMvc;

  @Test
  void homeReturnsTeasers() throws Exception {
    mockMvc
        .perform(get("/api/catalog/home"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.teaser.length()").value(org.hamcrest.Matchers.greaterThan(0)));
  }

  @Test
  void classicCategoryListsProducts() throws Exception {
    mockMvc
        .perform(get("/api/catalog/categories/classic"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.key").value("classic"))
        .andExpect(jsonPath("$.products.length()").value(org.hamcrest.Matchers.greaterThan(0)));
  }

  @Test
  void autonomousCategoryListsProducts() throws Exception {
    mockMvc
        .perform(get("/api/catalog/categories/autonomous"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.key").value("autonomous"));
  }

  @Test
  void unknownCategoryReturnsNotFound() throws Exception {
    mockMvc
        .perform(get("/api/catalog/categories/unknown-filter"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("PRODUCT_NOT_FOUND"));
  }

  @Test
  void productDetailReturnsVariants() throws Exception {
    mockMvc
        .perform(get("/api/catalog/products/AU-02"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value("AU-02"))
        .andExpect(jsonPath("$.variants.length()").value(org.hamcrest.Matchers.greaterThan(0)));
  }

  @Test
  void unknownProductReturnsNotFound() throws Exception {
    mockMvc
        .perform(get("/api/catalog/products/DOES-NOT-EXIST"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("PRODUCT_NOT_FOUND"));
  }

  @Test
  void recommendationsFromSkus() throws Exception {
    mockMvc
        .perform(get("/api/catalog/recommendations").param("skus", "AU-02-OG,AU-02-BL"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.products").isArray());
  }

  @Test
  void emptyRecommendationsWhenNoSkus() throws Exception {
    mockMvc
        .perform(get("/api/catalog/recommendations"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.products").isEmpty());
  }

  @Test
  void recommendationsWithValidSkusReturnProducts() throws Exception {
    mockMvc
        .perform(get("/api/catalog/recommendations").param("skus", "AU-02-OG"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.products.length()").value(org.hamcrest.Matchers.greaterThan(0)));
  }

  @Test
  void recommendationsWithUnknownSkusReturnEmpty() throws Exception {
    mockMvc
        .perform(get("/api/catalog/recommendations").param("skus", "UNKNOWN-SKU"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.products").isEmpty());
  }

  @Test
  void storesEndpointListsPickupLocations() throws Exception {
    mockMvc
        .perform(get("/api/catalog/stores"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").exists())
        .andExpect(jsonPath("$[0].name").exists());
  }
}
