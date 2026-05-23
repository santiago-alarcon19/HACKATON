package com.tractorstore.cart.internal.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cart_session")
public class CartSessionEntity {

  @Id private UUID id;
  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

  @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CartItemEntity> items = new ArrayList<>();

  protected CartSessionEntity() {}

  public CartSessionEntity(UUID id) {
    this.id = id;
  }

  public UUID getId() {
    return id;
  }

  public List<CartItemEntity> getItems() {
    return items;
  }

  public void touch() {
    updatedAt = Instant.now();
  }

  public CartItemEntity addItem(String sku, int quantity) {
    CartItemEntity item = new CartItemEntity(sku, quantity);
    item.setSession(this);
    items.add(item);
    return item;
  }
}
