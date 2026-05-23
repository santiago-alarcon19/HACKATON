package com.tractorstore.shared.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.tractorstore.shared.exception.BusinessException;
import com.tractorstore.shared.exception.CartEmptyException;
import com.tractorstore.shared.exception.OrderNotFoundException;
import com.tractorstore.shared.exception.OutOfStockException;
import com.tractorstore.shared.exception.ProductNotFoundException;
import com.tractorstore.shared.exception.StoreNotFoundException;
import com.tractorstore.shared.exception.VariantNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

  @Test
  void notFoundExceptionsMapTo404() {
    assertStatus(new ProductNotFoundException("x"), HttpStatus.NOT_FOUND, "PRODUCT_NOT_FOUND");
    assertStatus(new VariantNotFoundException("x"), HttpStatus.NOT_FOUND, "VARIANT_NOT_FOUND");
    assertStatus(new StoreNotFoundException("x"), HttpStatus.NOT_FOUND, "STORE_NOT_FOUND");
    assertStatus(new OrderNotFoundException("x"), HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND");
  }

  @Test
  void conflictExceptionsMapTo409() {
    assertStatus(new OutOfStockException("x"), HttpStatus.CONFLICT, "OUT_OF_STOCK");
    assertStatus(new CartEmptyException(), HttpStatus.CONFLICT, "CART_EMPTY");
  }

  @Test
  void unknownBusinessCodeMapsTo400() {
    ResponseEntity<ErrorResponse> response =
        handler.handleBusiness(new BusinessException("CUSTOM", "Something went wrong"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody().code()).isEqualTo("CUSTOM");
  }

  @Test
  void validationErrorsMapTo400WithFieldDetails() {
    FieldError fieldError = new FieldError("request", "sku", "must not be blank");
    var bindingResult = new org.springframework.validation.BeanPropertyBindingResult(new Object(), "request");
    bindingResult.addError(fieldError);
    MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

    ResponseEntity<ErrorResponse> response = handler.handleValidation(ex);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(response.getBody().code()).isEqualTo("VALIDATION_ERROR");
    assertThat(response.getBody().details()).containsEntry("sku", "must not be blank");
  }

  @Test
  void validationUsesFallbackMessageWhenDefaultIsNull() {
    FieldError fieldError = new FieldError("request", "sku", null, false, null, null, null);
    var bindingResult = new org.springframework.validation.BeanPropertyBindingResult(new Object(), "request");
    bindingResult.addError(fieldError);
    MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

    ResponseEntity<ErrorResponse> response = handler.handleValidation(ex);

    assertThat(response.getBody().details()).containsEntry("sku", "invalid");
  }

  @Test
  void unexpectedExceptionMapsTo500() {
    ResponseEntity<ErrorResponse> response = handler.handleGeneric(new RuntimeException("boom"));

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    assertThat(response.getBody().code()).isEqualTo("INTERNAL_ERROR");
  }

  private void assertStatus(
      RuntimeException exception, HttpStatus expectedStatus, String expectedCode) {
    ResponseEntity<ErrorResponse> response =
        handler.handleBusiness((com.tractorstore.shared.exception.BusinessException) exception);
    assertThat(response.getStatusCode()).isEqualTo(expectedStatus);
    assertThat(response.getBody().code()).isEqualTo(expectedCode);
  }
}
