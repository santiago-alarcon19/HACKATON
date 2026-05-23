package com.tractorstore.order.api.events;

import java.util.UUID;

public record OrderPlacedEvent(UUID orderId, String storeId, int total) {}
