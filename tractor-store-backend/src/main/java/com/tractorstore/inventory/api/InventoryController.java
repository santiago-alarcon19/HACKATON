package com.tractorstore.inventory.api;

import com.tractorstore.inventory.api.dto.StockDto;
import com.tractorstore.inventory.internal.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

  private final InventoryService inventoryService;

  public InventoryController(InventoryService inventoryService) {
    this.inventoryService = inventoryService;
  }

  @GetMapping("/{sku}")
  @Operation(summary = "Available stock for a variant SKU")
  public StockDto stock(@PathVariable String sku) {
    return inventoryService.getStock(sku);
  }
}
