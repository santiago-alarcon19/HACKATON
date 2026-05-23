package com.tractorstore.order.internal.repository;

import com.tractorstore.order.internal.domain.OrderEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

  @EntityGraph(attributePaths = "items")
  Optional<OrderEntity> findWithItemsById(UUID id);
}
