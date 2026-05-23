package com.tractorstore.order.api;

import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.internal.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @GetMapping("/{id}")
  @Operation(summary = "Retrieve order by id")
  public OrderResponse getOrder(@PathVariable UUID id) {
    return orderService.getOrder(id);
  }
}
