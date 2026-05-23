package com.tractorstore.shared.web;

import com.tractorstore.shared.exception.BusinessException;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
    HttpStatus status =
        switch (ex.getCode()) {
          case "PRODUCT_NOT_FOUND", "VARIANT_NOT_FOUND", "STORE_NOT_FOUND", "ORDER_NOT_FOUND" ->
              HttpStatus.NOT_FOUND;
          case "OUT_OF_STOCK", "CART_EMPTY" -> HttpStatus.CONFLICT;
          default -> HttpStatus.BAD_REQUEST;
        };
    return ResponseEntity.status(status).body(new ErrorResponse(ex.getCode(), ex.getMessage(), null));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, Object> fieldErrors =
        ex.getBindingResult().getFieldErrors().stream()
            .collect(
                Collectors.toMap(
                    err -> err.getField(),
                    err -> err.getDefaultMessage() != null ? err.getDefaultMessage() : "invalid",
                    (a, b) -> a));
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("VALIDATION_ERROR", "Request validation failed", fieldErrors));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ErrorResponse("INTERNAL_ERROR", "Unexpected server error", null));
  }
}
