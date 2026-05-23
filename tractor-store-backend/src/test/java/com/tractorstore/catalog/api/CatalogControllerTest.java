package com.tractorstore.catalog.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tractorstore.catalog.api.dto.CategoryResponse;
import com.tractorstore.catalog.api.dto.HomeResponse;
import com.tractorstore.catalog.api.dto.RecommendationsResponse;
import com.tractorstore.catalog.internal.CatalogService;
import com.tractorstore.shared.web.GlobalExceptionHandler;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CatalogController.class)
@Import(GlobalExceptionHandler.class)
class CatalogControllerTest {

  @Autowired MockMvc mockMvc;

  @MockitoBean CatalogService catalogService;

  @Test
  void homeEndpointReturnsOk() throws Exception {
    when(catalogService.getHome()).thenReturn(new HomeResponse(List.of()));

    mockMvc.perform(get("/api/catalog/home")).andExpect(status().isOk());
  }

  @Test
  void categoryEndpointReturnsOk() throws Exception {
    when(catalogService.getCategory("classic"))
        .thenReturn(new CategoryResponse("classic", "Classics", List.of(), List.of("classic")));

    mockMvc.perform(get("/api/catalog/categories/classic")).andExpect(status().isOk());
  }

  @Test
  void recommendationsEndpointParsesSkus() throws Exception {
    when(catalogService.getRecommendations(List.of("AU-02-OG", "AU-02-BL")))
        .thenReturn(new RecommendationsResponse(List.of()));

    mockMvc
        .perform(get("/api/catalog/recommendations").param("skus", "AU-02-OG,AU-02-BL"))
        .andExpect(status().isOk());
  }

  @Test
  void storesEndpointReturnsOk() throws Exception {
    when(catalogService.getStores()).thenReturn(List.of());

    mockMvc.perform(get("/api/catalog/stores")).andExpect(status().isOk());
  }
}
