package com.tractorstore.order.internal;

import com.tractorstore.catalog.api.CatalogApi;
import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderLineItemDto;
import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.api.events.OrderPlacedEvent;
import com.tractorstore.order.internal.domain.OrderEntity;
import com.tractorstore.order.internal.domain.OrderLineItemEntity;
import com.tractorstore.order.internal.repository.OrderRepository;
import com.tractorstore.shared.exception.OrderNotFoundException;
import com.tractorstore.shared.exception.StoreNotFoundException;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderService {

  private final OrderRepository orderRepository;
  private final CatalogApi catalogApi;
  private final ApplicationEventPublisher events;

  public OrderService(
      OrderRepository orderRepository,
      CatalogApi catalogApi,
      ApplicationEventPublisher events) {
    this.orderRepository = orderRepository;
    this.catalogApi = catalogApi;
    this.events = events;
  }

  public OrderResponse createOrder(CreateOrderCommand command) {
    if (!catalogApi.storeExists(command.storeId())) {
      throw new StoreNotFoundException(command.storeId());
    }
    UUID id = UUID.randomUUID();
    int total =
        command.items().stream()
            .mapToInt(item -> item.price() * item.quantity())
            .sum();

    OrderEntity order =
        new OrderEntity(id, command.storeId(), command.firstname(), command.lastname(), total);
    for (CreateOrderCommand.CreateOrderLineItem item : command.items()) {
      order.addItem(
          new OrderLineItemEntity(
              item.sku(), item.name(), item.image(), item.price(), item.quantity()));
    }
    orderRepository.save(order);
    events.publishEvent(new OrderPlacedEvent(id, command.storeId(), total));
    return toResponse(order);
  }

  @Transactional(readOnly = true)
  public OrderResponse getOrder(UUID id) {
    OrderEntity order =
        orderRepository.findWithItemsById(id).orElseThrow(() -> new OrderNotFoundException(id.toString()));
    return toResponse(order);
  }

  private static OrderResponse toResponse(OrderEntity order) {
    return new OrderResponse(
        order.getId(),
        order.getFirstname(),
        order.getLastname(),
        order.getStoreId(),
        order.getTotal(),
        order.getItems().stream()
            .map(
                item ->
                    new OrderLineItemDto(
                        item.getSku(),
                        item.getName(),
                        item.getImage(),
                        item.getPrice(),
                        item.getQuantity()))
            .toList());
  }
}
