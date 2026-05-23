package com.tractorstore;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tractorstore.notifications.internal.repository.NotificationLogRepository;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
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
  @Autowired NotificationLogRepository notificationLogRepository;

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

    assertThat(notificationLogRepository.count()).isPositive();
  }

  @Test
  void getCartReturnsLineItemsAndTotal() throws Exception {
    MvcResult addResult =
        mockMvc
            .perform(
                post("/api/cart/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"sku\":\"AU-02-OG\"}"))
            .andExpect(status().isOk())
            .andReturn();

    Cookie sessionCookie = addResult.getResponse().getCookie("TRACTOR_CART_SESSION");

    mockMvc
        .perform(get("/api/cart").cookie(sessionCookie))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items.length()").value(1))
        .andExpect(jsonPath("$.total").isNumber());
  }

  @Test
  void addingSameSkuIncrementsQuantity() throws Exception {
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
        .perform(
            post("/api/cart/items")
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"CL-01-GR\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items[0].quantity").value(2));
  }

  @Test
  void checkoutWithUnknownStoreIsRejected() throws Exception {
    MvcResult addResult =
        mockMvc
            .perform(
                post("/api/cart/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"sku\":\"AU-02-OG\"}"))
            .andExpect(status().isOk())
            .andReturn();

    Cookie sessionCookie = addResult.getResponse().getCookie("TRACTOR_CART_SESSION");

    mockMvc
        .perform(
            post("/api/orders")
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"firstname":"Ada","lastname":"Lovelace","storeId":"unknown-store"}
                    """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("STORE_NOT_FOUND"));
  }

  @Test
  void getUnknownOrderReturnsNotFound() throws Exception {
    mockMvc
        .perform(get("/api/orders/" + UUID.randomUUID()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("ORDER_NOT_FOUND"));
  }

  @Test
  void checkoutValidationFailsForBlankFields() throws Exception {
    MvcResult addResult =
        mockMvc
            .perform(
                post("/api/cart/items")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"sku\":\"AU-02-OG\"}"))
            .andExpect(status().isOk())
            .andReturn();

    Cookie sessionCookie = addResult.getResponse().getCookie("TRACTOR_CART_SESSION");

    mockMvc
        .perform(
            post("/api/orders")
                .cookie(sessionCookie)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"firstname":"","lastname":"","storeId":""}
                    """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
  }

  @Test
  void unknownInventorySkuReturnsNotFound() throws Exception {
    mockMvc
        .perform(get("/api/inventory/UNKNOWN-SKU"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("VARIANT_NOT_FOUND"));
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
