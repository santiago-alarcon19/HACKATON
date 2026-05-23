package com.tractorstore.order.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.internal.OrderService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired MockMvc mockMvc;

  @MockitoBean OrderService orderService;

  @Test
  void getOrderReturnsOk() throws Exception {
    UUID orderId = UUID.randomUUID();
    when(orderService.getOrder(orderId))
        .thenReturn(
            new OrderResponse(orderId, "Ada", "Lovelace", "store-a", 4100, List.of()));

    mockMvc.perform(get("/api/orders/" + orderId)).andExpect(status().isOk());
  }
}
