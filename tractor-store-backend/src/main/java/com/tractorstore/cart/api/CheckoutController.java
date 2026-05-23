package com.tractorstore.cart.api;

import com.tractorstore.cart.internal.CartService;
import com.tractorstore.order.api.dto.OrderResponse;
import com.tractorstore.order.api.dto.PlaceOrderRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Checkout uses cart session and delegates order creation to the Order module API. */
@RestController
@RequestMapping("/api/orders")
public class CheckoutController {

  private final CartService cartService;

  public CheckoutController(CartService cartService) {
    this.cartService = cartService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Confirm checkout from current cart session")
  public OrderResponse checkout(
      HttpServletRequest request,
      HttpServletResponse response,
      @Valid @RequestBody PlaceOrderRequest body) {
    return cartService.checkout(request, response, body);
  }
}
