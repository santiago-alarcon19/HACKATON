#!/usr/bin/env bash
# Fail if SonarCloud overall coverage metric is below MIN_COVERAGE (default 80).
set -euo pipefail

PROJECT_KEY="${1:?Project key required}"
MIN_COVERAGE="${2:-80}"
SONAR_HOST="${SONAR_HOST:-https://sonarcloud.io}"

if [[ -z "${SONAR_TOKEN:-}" ]]; then
  echo "ERROR: SONAR_TOKEN is not set"
  exit 1
fi

RESPONSE="$(curl -sS -u "${SONAR_TOKEN}:" \
  "${SONAR_HOST}/api/measures/component?component=${PROJECT_KEY}&metricKeys=coverage")"

COVERAGE="$(echo "${RESPONSE}" | python3 -c "
import json, sys
data = json.load(sys.stdin)
measures = data.get('component', {}).get('measures', [])
for measure in measures:
    if measure.get('metric') == 'coverage':
        print(measure.get('value', ''))
        break
")"

if [[ -z "${COVERAGE}" ]]; then
  echo "ERROR: could not read coverage metric for ${PROJECT_KEY}"
  echo "${RESPONSE}"
  exit 1
fi

echo "SonarCloud overall coverage (${PROJECT_KEY}): ${COVERAGE}% (minimum ${MIN_COVERAGE}%)"

python3 - <<PY
coverage = float("${COVERAGE}")
minimum = float("${MIN_COVERAGE}")
if coverage < minimum:
    raise SystemExit(f"FAIL: {coverage}% is below {minimum}%")
print("OK: SonarCloud coverage threshold met")
PY
