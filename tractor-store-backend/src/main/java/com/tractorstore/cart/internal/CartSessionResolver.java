package com.tractorstore.cart.internal;

import com.tractorstore.cart.internal.domain.CartSessionEntity;
import com.tractorstore.cart.internal.repository.CartSessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CartSessionResolver {

  private final String cookieName;
  private final Duration maxAge;
  private final CartSessionRepository sessionRepository;

  public CartSessionResolver(
      @Value("${tractor.cart.cookie-name}") String cookieName,
      @Value("${tractor.cart.cookie-max-age-days}") int maxAgeDays,
      CartSessionRepository sessionRepository) {
    this.cookieName = cookieName;
    this.maxAge = Duration.ofDays(maxAgeDays);
    this.sessionRepository = sessionRepository;
  }

  public UUID resolveSessionId(HttpServletRequest request, HttpServletResponse response) {
    Optional<UUID> fromCookie = readCookie(request);
    if (fromCookie.isPresent()) {
      UUID id = fromCookie.get();
      if (sessionRepository.existsById(id)) {
        return id;
      }
    }
    UUID newId = UUID.randomUUID();
    sessionRepository.save(new CartSessionEntity(newId));
    writeCookie(response, newId);
    return newId;
  }

  public Optional<UUID> currentSessionId(HttpServletRequest request) {
    return readCookie(request).filter(sessionRepository::existsById);
  }

  public void writeCookie(HttpServletResponse response, UUID sessionId) {
    ResponseCookie cookie =
        ResponseCookie.from(cookieName, sessionId.toString())
            .httpOnly(true)
            .path("/")
            .maxAge(maxAge)
            .sameSite("Lax")
            .build();
    response.addHeader("Set-Cookie", cookie.toString());
  }

  public void clearCookie(HttpServletResponse response) {
    ResponseCookie cookie =
        ResponseCookie.from(cookieName, "")
            .httpOnly(true)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
    response.addHeader("Set-Cookie", cookie.toString());
  }

  private Optional<UUID> readCookie(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return Optional.empty();
    }
    return Arrays.stream(request.getCookies())
        .filter(c -> cookieName.equals(c.getName()))
        .map(Cookie::getValue)
        .map(UUID::fromString)
        .findFirst();
  }
}
