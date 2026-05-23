package com.tractorstore.notifications.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tractorstore.notifications.internal.domain.NotificationLogEntity;
import com.tractorstore.notifications.internal.repository.NotificationLogRepository;
import com.tractorstore.order.api.events.OrderPlacedEvent;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderPlacedNotificationListenerTest {

  @Mock NotificationLogRepository repository;

  @InjectMocks OrderPlacedNotificationListener listener;

  @Test
  void onOrderPlacedPersistsNotificationLog() {
    UUID orderId = UUID.randomUUID();
    when(repository.save(any(NotificationLogEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    listener.onOrderPlaced(new OrderPlacedEvent(orderId, "store-a", 4100));

    verify(repository).save(any(NotificationLogEntity.class));
  }
}
