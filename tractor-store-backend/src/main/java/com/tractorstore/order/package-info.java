@org.springframework.modulith.ApplicationModule(
    displayName = "Order",
    allowedDependencies = {"catalog :: CatalogApi", "catalog :: CatalogDto", "shared :: SharedExceptions"})
package com.tractorstore.order;
