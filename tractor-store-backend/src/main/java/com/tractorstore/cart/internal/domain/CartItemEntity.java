package com.tractorstore.cart.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart_item")
public class CartItemEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "session_id")
  private CartSessionEntity session;

  private String sku;
  private int quantity;

  protected CartItemEntity() {}

  public CartItemEntity(String sku, int quantity) {
    this.sku = sku;
    this.quantity = quantity;
  }

  void setSession(CartSessionEntity session) {
    this.session = session;
  }

  public String getSku() {
    return sku;
  }

  public int getQuantity() {
    return quantity;
  }

  public void increment() {
    quantity++;
  }
}
