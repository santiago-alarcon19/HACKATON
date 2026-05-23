#!/usr/bin/env python3
"""Fail if Jest LCOV line coverage is below threshold (default 80%)."""
from __future__ import annotations

import sys
from pathlib import Path

THRESHOLD = float(sys.argv[1]) if len(sys.argv) > 1 else 80.0
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else ".").resolve()

COVERAGE_PACKAGES = (
    "shared-catalog",
    "ts-design-system",
    "mfe-checkout",
    "mfe-explore",
    "mfe-decide",
)


def merged_lcov_coverage(root: Path) -> tuple[int, int]:
    total_lf = 0
    total_lh = 0
    for package in COVERAGE_PACKAGES:
        lcov_file = root / "coverage" / "packages" / package / "lcov.info"
        if not lcov_file.exists():
            print(f"WARNING: missing coverage report for {package}")
            continue
        for raw in lcov_file.read_text(encoding="utf-8", errors="ignore").splitlines():
            if raw.startswith("LF:"):
                total_lf += int(raw[3:])
            elif raw.startswith("LH:"):
                total_lh += int(raw[3:])
    return total_lh, total_lf


def main() -> int:
    covered, total = merged_lcov_coverage(ROOT)
    if total == 0:
        print("ERROR: no LCOV line data found for unit-tested packages")
        return 1

    pct = covered / total * 100
    print(
        f"Jest line coverage: {pct:.2f}% "
        f"({covered}/{total} lines, minimum {THRESHOLD}%)"
    )
    if pct < THRESHOLD:
        print(f"FAIL: coverage {pct:.2f}% is below {THRESHOLD}%")
        return 1

    print("OK: coverage threshold met")
    return 0


if __name__ == "__main__":
    sys.exit(main())
