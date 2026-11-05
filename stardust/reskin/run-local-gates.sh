#!/bin/bash
# Phase 5 local gates (a, a′, b) for one archetype; same scopes/ledgers as the capture.
set -u
slug=$1; O=https://fortstreet-h.schools.nsw.gov.au; R=stardust/reskin; S=stardust/scripts/reskin
case $slug in
  home) url=$O/; scope='main';;
  learning-and-support-learning) url=$O/learning-and-support/learning; scope='nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!';;
esac
node $S/dom-equality.mjs --source "$url" --source-scope "$scope" --normalize $R/normalize/$slug.mjs --rendered $R/pages/$slug.html --rendered-scope main --report $R/reports/$slug-content-gate.md 2>&1 | grep -E "\] (PASS|FAIL)"
node $S/slot-coverage.mjs --model $R/content-model/$slug/content-model.json --rendered $R/pages/$slug.html --report $R/reports/$slug-slot-coverage.md 2>&1 | grep -E "\] (PASS|FAIL)|FAIL slot"
node $S/source-coverage.mjs --model $R/content-model/$slug/content-model.json --target $R/pages/$slug.html --declared $R/coverage/$slug.json --out $R/reports/$slug-source-coverage.json 2>&1 | tail -1
node $S/donor-probe.mjs --tokens $R/donor-tokens.json --rendered $R/pages/$slug.html --model $R/content-model/$slug/content-model.json --report $R/reports/$slug-donor-probe.md 2>&1 | grep -E "^\[donor"
