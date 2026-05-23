package com.tractorstore.catalog.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "catalog_store")
public class CatalogStoreEntity {

  @Id private String id;
  private String name;
  private String street;
  private String city;
  private String image;

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getStreet() {
    return street;
  }

  public String getCity() {
    return city;
  }

  public String getImage() {
    return image;
  }
}
