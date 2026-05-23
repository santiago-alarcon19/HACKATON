package com.tractorstore.order.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_line_item")
public class OrderLineItemEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "order_id")
  private OrderEntity order;

  private String sku;
  private String name;
  private String image;
  private int price;
  private int quantity;

  protected OrderLineItemEntity() {}

  public OrderLineItemEntity(String sku, String name, String image, int price, int quantity) {
    this.sku = sku;
    this.name = name;
    this.image = image;
    this.price = price;
    this.quantity = quantity;
  }

  void setOrder(OrderEntity order) {
    this.order = order;
  }

  public String getSku() {
    return sku;
  }

  public String getName() {
    return name;
  }

  public String getImage() {
    return image;
  }

  public int getPrice() {
    return price;
  }

  public int getQuantity() {
    return quantity;
  }
}
