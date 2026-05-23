package com.tractorstore.order.internal;

import com.tractorstore.order.api.OrderApi;
import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderResponse;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class OrderApiImpl implements OrderApi {

  private final OrderService orderService;

  public OrderApiImpl(OrderService orderService) {
    this.orderService = orderService;
  }

  @Override
  public OrderResponse createOrder(CreateOrderCommand command) {
    return orderService.createOrder(command);
  }

  @Override
  public OrderResponse getOrder(UUID id) {
    return orderService.getOrder(id);
  }
}
