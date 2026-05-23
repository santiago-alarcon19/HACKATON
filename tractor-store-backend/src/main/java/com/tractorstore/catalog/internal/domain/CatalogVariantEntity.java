package com.tractorstore.catalog.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "catalog_variant")
public class CatalogVariantEntity {

  @Id private String sku;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id")
  private CatalogProductEntity product;

  private String name;
  private String image;
  private String color;
  private int price;

  public String getSku() {
    return sku;
  }

  public CatalogProductEntity getProduct() {
    return product;
  }

  public String getName() {
    return name;
  }

  public String getImage() {
    return image;
  }

  public String getColor() {
    return color;
  }

  public int getPrice() {
    return price;
  }
}
