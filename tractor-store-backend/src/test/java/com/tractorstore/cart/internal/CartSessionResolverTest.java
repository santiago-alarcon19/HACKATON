package com.tractorstore.cart.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tractorstore.cart.internal.domain.CartSessionEntity;
import com.tractorstore.cart.internal.repository.CartSessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CartSessionResolverTest {

  @Mock CartSessionRepository sessionRepository;
  @Mock HttpServletRequest request;
  @Mock HttpServletResponse response;

  CartSessionResolver resolver;

  @BeforeEach
  void setUp() {
    resolver = new CartSessionResolver("TRACTOR_CART_SESSION", 7, sessionRepository);
  }

  @Test
  void resolveCreatesSessionWhenCookieMissing() {
    when(request.getCookies()).thenReturn(null);
    when(sessionRepository.save(any(CartSessionEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    UUID sessionId = resolver.resolveSessionId(request, response);

    assertThat(sessionId).isNotNull();
    verify(response).addHeader(org.mockito.ArgumentMatchers.eq("Set-Cookie"), org.mockito.ArgumentMatchers.contains(sessionId.toString()));
  }

  @Test
  void resolveReusesExistingSessionFromCookie() {
    UUID existing = UUID.randomUUID();
    when(request.getCookies())
        .thenReturn(new Cookie[] {new Cookie("TRACTOR_CART_SESSION", existing.toString())});
    when(sessionRepository.existsById(existing)).thenReturn(true);

    UUID sessionId = resolver.resolveSessionId(request, response);

    assertThat(sessionId).isEqualTo(existing);
  }

  @Test
  void currentSessionIdReturnsEmptyWhenCookieMissing() {
    when(request.getCookies()).thenReturn(null);

    assertThat(resolver.currentSessionId(request)).isEmpty();
  }

  @Test
  void clearCookieSetsMaxAgeZero() {
    resolver.clearCookie(response);

    ArgumentCaptor<String> valueCaptor = ArgumentCaptor.forClass(String.class);
    verify(response).addHeader(org.mockito.ArgumentMatchers.eq("Set-Cookie"), valueCaptor.capture());
    assertThat(valueCaptor.getValue()).contains("Max-Age=0");
  }
}
