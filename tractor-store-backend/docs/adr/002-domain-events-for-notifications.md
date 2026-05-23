# ADR 002: Domain events for cross-module notifications

## Status

Accepted

## Context

When an order is placed, the notifications module must record a confirmation without the order module knowing about email templates, logs, or future channels.

## Decision

The order module publishes `OrderPlacedEvent` after persisting the order. The notifications module subscribes with `@TransactionalEventListener(AFTER_COMMIT)` and writes to `notifications_log`.

Cart → Order remains a **synchronous call** to `OrderApi` during checkout (stock reservation and order creation must complete in one request). Only post-commit side effects use events.

## Consequences

- **Positive:** Order module stays focused; new subscribers (email, analytics) do not change order code.
- **Positive:** AFTER_COMMIT avoids listeners rolling back the order transaction.
- **Negative:** In-process events only; no outbox to external brokers yet (Spring Modulith outbox is a future step).
