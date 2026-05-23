package com.tractorstore.cart.internal;

import com.tractorstore.cart.api.dto.CartResponse;
import com.tractorstore.cart.api.dto.LineItemDto;
import com.tractorstore.cart.api.dto.MiniCartResponse;
import com.tractorstore.cart.internal.domain.CartItemEntity;
import com.tractorstore.cart.internal.domain.CartSessionEntity;
import com.tractorstore.cart.internal.repository.CartSessionRepository;
import com.tractorstore.catalog.api.CatalogApi;
import com.tractorstore.catalog.api.dto.VariantDto;
import com.tractorstore.inventory.api.InventoryApi;
import com.tractorstore.order.api.OrderApi;
import com.tractorstore.order.api.dto.CreateOrderCommand;
import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.api.dto.PlaceOrderRequest;
import com.tractorstore.shared.exception.CartEmptyException;
import com.tractorstore.shared.exception.OutOfStockException;
import com.tractorstore.shared.exception.VariantNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {

  private final CartSessionRepository sessionRepository;
  private final CartSessionResolver sessionResolver;
  private final CatalogApi catalogApi;
  private final InventoryApi inventoryApi;
  private final OrderApi orderApi;

  public CartService(
      CartSessionRepository sessionRepository,
      CartSessionResolver sessionResolver,
      CatalogApi catalogApi,
      InventoryApi inventoryApi,
      OrderApi orderApi) {
    this.sessionRepository = sessionRepository;
    this.sessionResolver = sessionResolver;
    this.catalogApi = catalogApi;
    this.inventoryApi = inventoryApi;
    this.orderApi = orderApi;
  }

  public CartResponse getCart(HttpServletRequest request, HttpServletResponse response) {
    CartSessionEntity session = loadSession(request, response);
    return toCartResponse(session);
  }

  public MiniCartResponse getMiniCart(HttpServletRequest request, HttpServletResponse response) {
    CartSessionEntity session = loadSession(request, response);
    int quantity = session.getItems().stream().mapToInt(CartItemEntity::getQuantity).sum();
    return new MiniCartResponse(quantity);
  }

  public CartResponse addItem(
      HttpServletRequest request, HttpServletResponse response, String sku) {
    VariantDto variant =
        catalogApi.findVariant(sku).orElseThrow(() -> new VariantNotFoundException(sku));
    if (inventoryApi.available(sku) < 1) {
      throw new OutOfStockException(sku);
    }

    CartSessionEntity session = loadSession(request, response);
    CartItemEntity existing =
        session.getItems().stream().filter(i -> i.getSku().equals(sku)).findFirst().orElse(null);
    if (existing != null) {
      if (inventoryApi.available(sku) < existing.getQuantity() + 1) {
        throw new OutOfStockException(sku);
      }
      existing.increment();
    } else {
      session.addItem(sku, 1);
    }
    session.touch();
    sessionRepository.save(session);
    return toCartResponse(session);
  }

  public CartResponse removeItem(
      HttpServletRequest request, HttpServletResponse response, String sku) {
    CartSessionEntity session = loadSession(request, response);
    session.getItems().removeIf(item -> item.getSku().equals(sku));
    session.touch();
    sessionRepository.save(session);
    return toCartResponse(session);
  }

  public OrderResponse checkout(
      HttpServletRequest request, HttpServletResponse response, PlaceOrderRequest placeOrder) {
    UUID sessionId =
        sessionResolver
            .currentSessionId(request)
            .orElseThrow(CartEmptyException::new);
    CartSessionEntity session =
        sessionRepository
            .findWithItemsById(sessionId)
            .orElseThrow(CartEmptyException::new);
    if (session.getItems().isEmpty()) {
      throw new CartEmptyException();
    }

    List<CreateOrderCommand.CreateOrderLineItem> lineItems = new ArrayList<>();
    for (CartItemEntity cartItem : session.getItems()) {
      VariantDto variant =
          catalogApi
              .findVariant(cartItem.getSku())
              .orElseThrow(() -> new VariantNotFoundException(cartItem.getSku()));
      inventoryApi.reserve(cartItem.getSku(), cartItem.getQuantity());
      lineItems.add(
          new CreateOrderCommand.CreateOrderLineItem(
              variant.sku(),
              variant.name(),
              variant.image(),
              variant.price(),
              cartItem.getQuantity()));
    }

    OrderResponse order =
        orderApi.createOrder(
            new CreateOrderCommand(
                placeOrder.firstname(),
                placeOrder.lastname(),
                placeOrder.storeId(),
                lineItems));

    session.getItems().clear();
    sessionRepository.delete(session);
    sessionResolver.clearCookie(response);
    return order;
  }

  private CartSessionEntity loadSession(HttpServletRequest request, HttpServletResponse response) {
    UUID sessionId = sessionResolver.resolveSessionId(request, response);
    return sessionRepository
        .findWithItemsById(sessionId)
        .orElseGet(
            () -> {
              CartSessionEntity created = new CartSessionEntity(sessionId);
              return sessionRepository.save(created);
            });
  }

  private CartResponse toCartResponse(CartSessionEntity session) {
    List<LineItemDto> items = new ArrayList<>();
    int total = 0;
    for (CartItemEntity cartItem : session.getItems()) {
      VariantDto variant =
          catalogApi
              .findVariant(cartItem.getSku())
              .orElseThrow(() -> new VariantNotFoundException(cartItem.getSku()));
      items.add(
          new LineItemDto(
              variant.sku(),
              variant.name(),
              variant.image(),
              variant.price(),
              cartItem.getQuantity()));
      total += variant.price() * cartItem.getQuantity();
    }
    return new CartResponse(items, total);
  }
}
