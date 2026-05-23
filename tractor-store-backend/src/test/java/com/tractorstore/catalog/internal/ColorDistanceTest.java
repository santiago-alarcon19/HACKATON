package com.tractorstore.catalog.internal;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ColorDistanceTest {

  @Test
  void identicalColorsHaveZeroDistance() {
    assertThat(ColorDistance.between("#FF0000", "#FF0000")).isZero();
  }

  @Test
  void differentColorsHavePositiveDistance() {
    assertThat(ColorDistance.between("#FF0000", "#0000FF")).isPositive();
  }
}
