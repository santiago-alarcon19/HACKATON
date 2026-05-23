package com.tractorstore.cart.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

  private static final VariantDto VARIANT =
      new VariantDto("Sunset Copper", "/img.jpg", "AU-02-OG", "#dd5219", 4100);

  @Mock CartSessionRepository sessionRepository;
  @Mock CartSessionResolver sessionResolver;
  @Mock CatalogApi catalogApi;
  @Mock InventoryApi inventoryApi;
  @Mock OrderApi orderApi;
  @Mock HttpServletRequest request;
  @Mock HttpServletResponse response;

  @InjectMocks CartService cartService;

  UUID sessionId;

  @BeforeEach
  void setUp() {
    sessionId = UUID.randomUUID();
  }

  @Test
  void addItemCreatesLineWhenSkuIsValid() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    when(sessionResolver.resolveSessionId(request, response)).thenReturn(sessionId);
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));
    when(catalogApi.findVariant("AU-02-OG")).thenReturn(Optional.of(VARIANT));
    when(inventoryApi.available("AU-02-OG")).thenReturn(5);
    when(sessionRepository.save(session)).thenReturn(session);

    var cart = cartService.addItem(request, response, "AU-02-OG");

    assertThat(cart.items()).hasSize(1);
    assertThat(cart.total()).isEqualTo(4100);
  }

  @Test
  void addItemThrowsWhenSkuUnknown() {
    when(catalogApi.findVariant("MISSING")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> cartService.addItem(request, response, "MISSING"))
        .isInstanceOf(VariantNotFoundException.class);
  }

  @Test
  void addItemThrowsWhenOutOfStock() {
    when(catalogApi.findVariant("AU-02-OG")).thenReturn(Optional.of(VARIANT));
    when(inventoryApi.available("AU-02-OG")).thenReturn(0);

    assertThatThrownBy(() -> cartService.addItem(request, response, "AU-02-OG"))
        .isInstanceOf(OutOfStockException.class);
  }

  @Test
  void checkoutClearsSessionAndReturnsOrder() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    session.addItem("AU-02-OG", 1);
    when(sessionResolver.currentSessionId(request)).thenReturn(Optional.of(sessionId));
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));
    when(catalogApi.findVariant("AU-02-OG")).thenReturn(Optional.of(VARIANT));
    when(orderApi.createOrder(any(CreateOrderCommand.class)))
        .thenReturn(
            new OrderResponse(
                UUID.randomUUID(),
                "Ada",
                "Lovelace",
                "store-a",
                4100,
                java.util.List.of()));

    OrderResponse order =
        cartService.checkout(request, response, new PlaceOrderRequest("Ada", "Lovelace", "store-a"));

    assertThat(order.firstname()).isEqualTo("Ada");
    verify(inventoryApi).reserve("AU-02-OG", 1);
    verify(sessionRepository).delete(session);
    verify(sessionResolver).clearCookie(response);
  }

  @Test
  void checkoutThrowsWhenCartIsEmpty() {
    when(sessionResolver.currentSessionId(request)).thenReturn(Optional.empty());

    assertThatThrownBy(
            () ->
                cartService.checkout(
                    request, response, new PlaceOrderRequest("Ada", "Lovelace", "store-a")))
        .isInstanceOf(CartEmptyException.class);

    verify(orderApi, never()).createOrder(any());
  }

  @Test
  void addItemIncrementsQuantityWhenSkuAlreadyInCart() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    session.addItem("AU-02-OG", 1);
    when(sessionResolver.resolveSessionId(request, response)).thenReturn(sessionId);
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));
    when(catalogApi.findVariant("AU-02-OG")).thenReturn(Optional.of(VARIANT));
    when(inventoryApi.available("AU-02-OG")).thenReturn(5);
    when(sessionRepository.save(session)).thenReturn(session);

    var cart = cartService.addItem(request, response, "AU-02-OG");

    assertThat(cart.items()).hasSize(1);
    assertThat(cart.items().get(0).quantity()).isEqualTo(2);
    assertThat(cart.total()).isEqualTo(8200);
  }

  @Test
  void getCartCreatesSessionWhenMissing() {
    when(sessionResolver.resolveSessionId(request, response)).thenReturn(sessionId);
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.empty());
    when(sessionRepository.save(any(CartSessionEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    var cart = cartService.getCart(request, response);

    assertThat(cart.items()).isEmpty();
    assertThat(cart.total()).isZero();
  }

  @Test
  void removeItemDropsLineFromSession() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    session.addItem("AU-02-OG", 1);
    when(sessionResolver.resolveSessionId(request, response)).thenReturn(sessionId);
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));
    when(sessionRepository.save(session)).thenReturn(session);

    var cart = cartService.removeItem(request, response, "AU-02-OG");

    assertThat(cart.items()).isEmpty();
    assertThat(cart.total()).isZero();
  }

  @Test
  void checkoutThrowsWhenSessionHasNoItems() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    when(sessionResolver.currentSessionId(request)).thenReturn(Optional.of(sessionId));
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));

    assertThatThrownBy(
            () ->
                cartService.checkout(
                    request, response, new PlaceOrderRequest("Ada", "Lovelace", "store-a")))
        .isInstanceOf(CartEmptyException.class);
  }

  @Test
  void getMiniCartReturnsItemCount() {
    CartSessionEntity session = new CartSessionEntity(sessionId);
    session.addItem("AU-02-OG", 2);
    when(sessionResolver.resolveSessionId(request, response)).thenReturn(sessionId);
    when(sessionRepository.findWithItemsById(sessionId)).thenReturn(Optional.of(session));

    assertThat(cartService.getMiniCart(request, response).quantity()).isEqualTo(2);
  }
}
