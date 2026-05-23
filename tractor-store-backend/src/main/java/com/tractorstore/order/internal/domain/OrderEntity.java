package com.tractorstore.order.internal.domain;

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
@Table(name = "order_order")
public class OrderEntity {

  @Id private UUID id;
  private String storeId;
  private String firstname;
  private String lastname;
  private int total;
  private Instant createdAt = Instant.now();

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderLineItemEntity> items = new ArrayList<>();

  protected OrderEntity() {}

  public OrderEntity(UUID id, String storeId, String firstname, String lastname, int total) {
    this.id = id;
    this.storeId = storeId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.total = total;
  }

  public UUID getId() {
    return id;
  }

  public String getStoreId() {
    return storeId;
  }

  public String getFirstname() {
    return firstname;
  }

  public String getLastname() {
    return lastname;
  }

  public int getTotal() {
    return total;
  }

  public List<OrderLineItemEntity> getItems() {
    return items;
  }

  public void addItem(OrderLineItemEntity item) {
    item.setOrder(this);
    items.add(item);
  }
}
