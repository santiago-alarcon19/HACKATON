package com.tractorstore.cart.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tractorstore.cart.api.dto.CartResponse;
import com.tractorstore.cart.api.dto.MiniCartResponse;
import com.tractorstore.cart.internal.CartService;
import com.tractorstore.shared.web.GlobalExceptionHandler;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({CartController.class, CheckoutController.class})
@Import(GlobalExceptionHandler.class)
class CartControllersTest {

  @Autowired MockMvc mockMvc;

  @MockitoBean CartService cartService;

  @Test
  void cartEndpointsReturnOk() throws Exception {
    when(cartService.getCart(any(), any())).thenReturn(new CartResponse(List.of(), 0));
    when(cartService.getMiniCart(any(), any())).thenReturn(new MiniCartResponse(0));
    when(cartService.addItem(any(), any(), any())).thenReturn(new CartResponse(List.of(), 0));
    when(cartService.removeItem(any(), any(), any())).thenReturn(new CartResponse(List.of(), 0));

    mockMvc.perform(get("/api/cart")).andExpect(status().isOk());
    mockMvc.perform(get("/api/cart/mini")).andExpect(status().isOk());
    mockMvc
        .perform(
            post("/api/cart/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sku\":\"AU-02-OG\"}"))
        .andExpect(status().isOk());
    mockMvc.perform(delete("/api/cart/items/AU-02-OG")).andExpect(status().isOk());
  }
}
