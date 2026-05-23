package com.tractorstore.catalog.internal;

/** RGB color distance for product recommendations (tractor-store blueprint algorithm). */
public final class ColorDistance {

  private ColorDistance() {}

  public static double between(String hexA, String hexB) {
    int[] a = parseHex(hexA);
    int[] b = parseHex(hexB);
    int dr = a[0] - b[0];
    int dg = a[1] - b[1];
    int db = a[2] - b[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  private static int[] parseHex(String hex) {
    String normalized = hex.startsWith("#") ? hex.substring(1) : hex;
    if (normalized.length() != 6) {
      return new int[] {0, 0, 0};
    }
    return new int[] {
      Integer.parseInt(normalized.substring(0, 2), 16),
      Integer.parseInt(normalized.substring(2, 4), 16),
      Integer.parseInt(normalized.substring(4, 6), 16)
    };
  }
}
