package com.tractorstore.notifications.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications_log")
public class NotificationLogEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private UUID orderId;
  private String channel;
  private String message;
  private Instant createdAt = Instant.now();

  protected NotificationLogEntity() {}

  public NotificationLogEntity(UUID orderId, String channel, String message) {
    this.orderId = orderId;
    this.channel = channel;
    this.message = message;
  }
}
