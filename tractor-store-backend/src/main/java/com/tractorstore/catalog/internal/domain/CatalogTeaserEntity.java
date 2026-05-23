package com.tractorstore.catalog.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "catalog_teaser")
public class CatalogTeaserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String image;
  private String url;
  private int sortOrder;

  public String getTitle() {
    return title;
  }

  public String getImage() {
    return image;
  }

  public String getUrl() {
    return url;
  }

  public int getSortOrder() {
    return sortOrder;
  }
}
