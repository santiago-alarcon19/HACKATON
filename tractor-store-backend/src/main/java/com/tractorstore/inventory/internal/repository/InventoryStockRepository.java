package com.tractorstore.inventory.internal.repository;

import com.tractorstore.inventory.internal.domain.InventoryStockEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryStockRepository extends JpaRepository<InventoryStockEntity, String> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from InventoryStockEntity s where s.sku = :sku")
  Optional<InventoryStockEntity> findForUpdate(@Param("sku") String sku);
}
