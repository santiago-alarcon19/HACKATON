package com.tractorstore.order.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tractorstore.catalog.api.CatalogApi;
import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.api.events.OrderPlacedEvent;
import com.tractorstore.order.internal.domain.OrderEntity;
import com.tractorstore.order.internal.domain.OrderLineItemEntity;
import com.tractorstore.order.internal.repository.OrderRepository;
import com.tractorstore.shared.exception.OrderNotFoundException;
import com.tractorstore.shared.exception.StoreNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

  @Mock OrderRepository orderRepository;
  @Mock CatalogApi catalogApi;
  @Mock ApplicationEventPublisher events;

  @InjectMocks OrderService orderService;

  @Test
  void createOrderPersistsAndPublishesEvent() {
    when(catalogApi.storeExists("store-a")).thenReturn(true);
    when(orderRepository.save(any(OrderEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

    CreateOrderCommand command =
        new CreateOrderCommand(
            "Ada",
            "Lovelace",
            "store-a",
            List.of(
                new CreateOrderCommand.CreateOrderLineItem(
                    "AU-02-OG", "Sunset Copper", "/img.jpg", 4100, 1)));

    OrderResponse response = orderService.createOrder(command);

    assertThat(response.firstname()).isEqualTo("Ada");
    assertThat(response.lastname()).isEqualTo("Lovelace");
    assertThat(response.total()).isEqualTo(4100);
    assertThat(response.items()).hasSize(1);

    ArgumentCaptor<OrderPlacedEvent> eventCaptor = ArgumentCaptor.forClass(OrderPlacedEvent.class);
    verify(events).publishEvent(eventCaptor.capture());
    assertThat(eventCaptor.getValue().storeId()).isEqualTo("store-a");
    assertThat(eventCaptor.getValue().total()).isEqualTo(4100);
  }

  @Test
  void createOrderThrowsWhenStoreMissing() {
    when(catalogApi.storeExists("missing")).thenReturn(false);

    CreateOrderCommand command =
        new CreateOrderCommand(
            "Ada",
            "Lovelace",
            "missing",
            List.of(
                new CreateOrderCommand.CreateOrderLineItem(
                    "AU-02-OG", "Sunset Copper", "/img.jpg", 4100, 1)));

    assertThatThrownBy(() -> orderService.createOrder(command))
        .isInstanceOf(StoreNotFoundException.class);
  }

  @Test
  void getOrderReturnsMappedResponse() {
    UUID orderId = UUID.randomUUID();
    OrderEntity order = new OrderEntity(orderId, "store-a", "Ada", "Lovelace", 8200);
    order.addItem(new OrderLineItemEntity("AU-02-OG", "Sunset Copper", "/img.jpg", 4100, 2));
    when(orderRepository.findWithItemsById(orderId)).thenReturn(Optional.of(order));

    OrderResponse response = orderService.getOrder(orderId);

    assertThat(response.id()).isEqualTo(orderId);
    assertThat(response.storeId()).isEqualTo("store-a");
    assertThat(response.items()).hasSize(1);
    assertThat(response.items().get(0).quantity()).isEqualTo(2);
  }

  @Test
  void getOrderThrowsWhenMissing() {
    UUID orderId = UUID.randomUUID();
    when(orderRepository.findWithItemsById(orderId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> orderService.getOrder(orderId))
        .isInstanceOf(OrderNotFoundException.class);
  }
}
