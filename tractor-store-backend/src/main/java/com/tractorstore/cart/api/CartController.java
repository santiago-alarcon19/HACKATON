package com.tractorstore.cart.api;

import com.tractorstore.cart.api.dto.AddCartItemRequest;
import com.tractorstore.cart.api.dto.CartResponse;
import com.tractorstore.cart.api.dto.MiniCartResponse;
import com.tractorstore.cart.internal.CartService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @GetMapping
  @Operation(summary = "Current shopping cart")
  public CartResponse cart(HttpServletRequest request, HttpServletResponse response) {
    return cartService.getCart(request, response);
  }

  @GetMapping("/mini")
  @Operation(summary = "Mini cart item count for header")
  public MiniCartResponse miniCart(HttpServletRequest request, HttpServletResponse response) {
    return cartService.getMiniCart(request, response);
  }

  @PostMapping("/items")
  @Operation(summary = "Add variant to cart")
  public CartResponse addItem(
      HttpServletRequest request,
      HttpServletResponse response,
      @Valid @RequestBody AddCartItemRequest body) {
    return cartService.addItem(request, response, body.sku());
  }

  @DeleteMapping("/items/{sku}")
  @Operation(summary = "Remove variant from cart")
  public CartResponse removeItem(
      HttpServletRequest request, HttpServletResponse response, @PathVariable String sku) {
    return cartService.removeItem(request, response, sku);
  }
}
