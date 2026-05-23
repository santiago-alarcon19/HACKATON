@org.springframework.modulith.ApplicationModule(
    displayName = "Cart",
    allowedDependencies = {
      "catalog :: CatalogApi",
      "catalog :: CatalogDto",
      "inventory :: InventoryApi",
      "inventory :: InventoryDto",
      "order :: OrderApi",
      "order :: OrderDto",
      "shared :: SharedExceptions"
    })
package com.tractorstore.cart;
