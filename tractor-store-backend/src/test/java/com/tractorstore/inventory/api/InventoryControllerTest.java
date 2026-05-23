package com.tractorstore.inventory.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tractorstore.inventory.api.dto.StockDto;
import com.tractorstore.inventory.internal.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(InventoryController.class)
class InventoryControllerTest {

  @Autowired MockMvc mockMvc;

  @MockitoBean InventoryService inventoryService;

  @Test
  void stockEndpointReturnsOk() throws Exception {
    when(inventoryService.getStock("AU-02-OG")).thenReturn(new StockDto("AU-02-OG", 10));

    mockMvc.perform(get("/api/inventory/AU-02-OG")).andExpect(status().isOk());
  }
}
