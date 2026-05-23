package com.tractorstore.order.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderResponse;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderApiImplTest {

  @Mock OrderService orderService;

  @InjectMocks OrderApiImpl orderApi;

  @Test
  void createOrderDelegatesToService() {
    CreateOrderCommand command =
        new CreateOrderCommand(
            "Ada",
            "Lovelace",
            "store-a",
            List.of(
                new CreateOrderCommand.CreateOrderLineItem(
                    "AU-02-OG", "Sunset Copper", "/img.jpg", 4100, 1)));
    OrderResponse expected =
        new OrderResponse(UUID.randomUUID(), "Ada", "Lovelace", "store-a", 4100, List.of());
    when(orderService.createOrder(command)).thenReturn(expected);

    assertThat(orderApi.createOrder(command)).isSameAs(expected);
  }

  @Test
  void getOrderDelegatesToService() {
    UUID orderId = UUID.randomUUID();
    OrderResponse expected =
        new OrderResponse(orderId, "Ada", "Lovelace", "store-a", 4100, List.of());
    when(orderService.getOrder(orderId)).thenReturn(expected);

    assertThat(orderApi.getOrder(orderId)).isSameAs(expected);
  }
}
