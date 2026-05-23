package com.tractorstore.catalog.internal.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "catalog_product")
public class CatalogProductEntity {

  @Id private String id;

  private String name;

  private String category;

  @JdbcTypeCode(SqlTypes.ARRAY)
  @Column(columnDefinition = "text[]")
  private String[] highlights = new String[0];

  @OneToMany(mappedBy = "product")
  private List<CatalogVariantEntity> variants = new ArrayList<>();

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getCategory() {
    return category;
  }

  public String[] getHighlights() {
    return highlights;
  }

  public List<CatalogVariantEntity> getVariants() {
    return variants;
  }
}
