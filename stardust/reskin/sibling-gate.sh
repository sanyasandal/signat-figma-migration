#!/bin/bash
# Sibling gate (handoff.md): the three gates on migrate's output against the live source.
slug=$1; url=$2; page=$3; R=stardust/reskin; S=stardust/scripts/reskin; G=$R/gates/$slug/migrated; mkdir -p $G
scope='nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!'
a=$(node $S/dom-equality.mjs --source "$url" --source-scope "$scope" --normalize $R/normalize/$slug.mjs --rendered $page --rendered-scope main --deltas $R/deltas/$slug.json --report $G/dom-equality.md 2>&1 | grep -oE "\] (PASS|FAIL|ADVISORY)" | tail -1)
b=$(node $S/slot-coverage.mjs --model $R/content-model/$slug/content-model.json --rendered $page --deltas $R/deltas/$slug.json --report $G/slot-coverage.md 2>&1 | grep -oE "\] (PASS|FAIL)[^—]*— [0-9/]+" | tail -1)
c=$(node $S/donor-probe.mjs --tokens $R/donor-tokens.json --rendered $page --model $R/content-model/$slug/content-model.json --report $G/donor-probe.md 2>&1 | grep -oE "^\[donor-probe\] (PASS|FAIL)[^—]*— [0-9/]+" | tail -1)
echo "$slug | dom$a | slot$b | probe ${c#\[donor-probe\]}"
