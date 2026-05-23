package com.tractorstore.order.api;

import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderResponse;
import java.util.UUID;

/** Public order module API (used by Cart on checkout). */
public interface OrderApi {

  OrderResponse createOrder(CreateOrderCommand command);

  OrderResponse getOrder(UUID id);
}
