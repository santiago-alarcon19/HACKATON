package com.tractorstore.notifications.internal.repository;

import com.tractorstore.notifications.internal.domain.NotificationLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationLogRepository extends JpaRepository<NotificationLogEntity, Long> {}
