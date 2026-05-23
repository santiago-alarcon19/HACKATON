#!/usr/bin/env python3
"""Fail if monorepo line coverage is below threshold (default 80%).

Untested source files count as 0% covered (aligned with SonarCloud overall Coverage).
"""
from __future__ import annotations

import sys
from pathlib import Path

THRESHOLD = float(sys.argv[1]) if len(sys.argv) > 1 else 80.0
ROOT = Path(sys.argv[2] if len(sys.argv) > 2 else ".").resolve()

SOURCE_ROOTS = ("apps", "packages", "tools")
SKIP_PARTS = (
    "node_modules",
    "dist",
    ".nx",
    "coverage",
    ".spec.ts",
    ".test.ts",
    "jest.config.ts",
    "webpack.config",
    "webpack.",
    "environment.prod",
    "environment.ts",
)
SOURCE_SUFFIXES = {".ts", ".js", ".html", ".css"}


def is_source(path: Path) -> bool:
    if path.suffix not in SOURCE_SUFFIXES:
        return False
    posix = path.as_posix()
    return not any(part in posix for part in SKIP_PARTS)


def load_lcov(root: Path) -> dict[Path, dict[int, int]]:
    coverage: dict[Path, dict[int, int]] = {}
    for lcov in root.glob("coverage/**/lcov.info"):
        current: Path | None = None
        for raw in lcov.read_text(encoding="utf-8", errors="ignore").splitlines():
            if raw.startswith("SF:"):
                sf = raw[3:].strip().replace("\\", "/")
                candidate = (root / sf).resolve()
                if not candidate.exists():
                    candidate = (lcov.parent / sf).resolve()
                current = candidate
                coverage.setdefault(current, {})
            elif raw.startswith("DA:") and current is not None:
                line, hit, *_ = raw[3:].split(",")
                coverage[current][int(line)] = int(hit)
    return coverage


def main() -> int:
    lcov_data = load_lcov(ROOT)
    total_lines = 0
    covered_lines = 0

    for src_root in SOURCE_ROOTS:
        base = ROOT / src_root
        if not base.exists():
            continue
        for file_path in base.rglob("*"):
            if not file_path.is_file() or not is_source(file_path):
                continue
            lines = [
                index
                for index, line in enumerate(
                    file_path.read_text(encoding="utf-8", errors="ignore").splitlines(),
                    1,
                )
                if line.strip()
            ]
            if not lines:
                continue
            hits = lcov_data.get(file_path.resolve(), {})
            for line_no in lines:
                total_lines += 1
                if hits.get(line_no, 0) > 0:
                    covered_lines += 1

    if total_lines == 0:
        print("ERROR: no source lines found under apps/, packages/ or tools/")
        return 1

    pct = covered_lines / total_lines * 100
    print(
        f"Monorepo line coverage: {pct:.2f}% "
        f"({covered_lines}/{total_lines} lines, minimum {THRESHOLD}%)"
    )
    if pct < THRESHOLD:
        print(f"FAIL: coverage {pct:.2f}% is below {THRESHOLD}%")
        return 1

    print("OK: coverage threshold met")
    return 0


if __name__ == "__main__":
    sys.exit(main())
