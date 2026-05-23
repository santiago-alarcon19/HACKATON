package com.tractorstore;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class CheckoutFlowIntegrationTest {

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
  @Autowired ObjectMapper objectMapper;

  @Test
  void fullCheckoutFlow() throws Exception {
    MvcResult addResult =
        mockMvc
            .perform(
                post("/api/cart/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"sku\":\"AU-02-OG\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items.length()").value(1))
            .andReturn();

    Cookie sessionCookie = addResult.getResponse().getCookie("TRACTOR_CART_SESSION");
    assertThat(sessionCookie).isNotNull();

    mockMvc
        .perform(get("/api/cart/mini").cookie(sessionCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(1));

    MvcResult orderResult =
        mockMvc
            .perform(
                post("/api/orders")
                    .cookie(sessionCookie)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {"firstname":"Ada","lastname":"Lovelace","storeId":"store-a"}
                        """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.firstname").value("Ada"))
            .andExpect(jsonPath("$.items.length()").value(1))
            .andReturn();

    JsonNode orderJson = objectMapper.readTree(orderResult.getResponse().getContentAsString());
    String orderId = orderJson.get("id").asText();

    mockMvc
        .perform(get("/api/orders/" + orderId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.storeId").value("store-a"));

    mockMvc
        .perform(get("/api/inventory/AU-02-OG"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(24));
  }

  @Test
  void outOfStockSkuIsRejected() throws Exception {
    mockMvc
        .perform(
            post("/api/cart/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"AU-01-SI\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("OUT_OF_STOCK"));
  }

  @Test
  void removeItemFromCart() throws Exception {
    MvcResult addResult =
        mockMvc
            .perform(
                post("/api/cart/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"sku\":\"CL-01-GR\"}"))
            .andExpect(status().isOk())
            .andReturn();

    Cookie sessionCookie = addResult.getResponse().getCookie("TRACTOR_CART_SESSION");

    mockMvc
        .perform(delete("/api/cart/items/CL-01-GR").cookie(sessionCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items").isEmpty());
  }
}
