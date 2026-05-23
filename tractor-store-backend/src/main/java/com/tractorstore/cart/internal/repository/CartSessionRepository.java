package com.tractorstore.cart.internal.repository;

import com.tractorstore.cart.internal.domain.CartSessionEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartSessionRepository extends JpaRepository<CartSessionEntity, UUID> {

  @EntityGraph(attributePaths = "items")
  Optional<CartSessionEntity> findWithItemsById(UUID id);
}
