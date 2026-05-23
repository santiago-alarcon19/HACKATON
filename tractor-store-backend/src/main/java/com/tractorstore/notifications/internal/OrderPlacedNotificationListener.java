package com.tractorstore.notifications.internal;

import com.tractorstore.notifications.internal.domain.NotificationLogEntity;
import com.tractorstore.notifications.internal.repository.NotificationLogRepository;
import com.tractorstore.order.api.events.OrderPlacedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class OrderPlacedNotificationListener {

  private static final Logger log = LoggerFactory.getLogger(OrderPlacedNotificationListener.class);

  private final NotificationLogRepository repository;

  public OrderPlacedNotificationListener(NotificationLogRepository repository) {
    this.repository = repository;
  }

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void onOrderPlaced(OrderPlacedEvent event) {
    String message =
        "Order %s confirmed for pickup at store %s (total: %d)"
            .formatted(event.orderId(), event.storeId(), event.total());
    repository.save(new NotificationLogEntity(event.orderId(), "log", message));
    log.info("Notification sent: {}", message);
  }
}
