#!/bin/bash
# Deployed leg (preview + content) for one page on the reskin branch preview, /reskin/ namespace.
slug=$1; path=$2
pv=$(node stardust/scripts/reskin/deployed-gate.mjs preview --page $slug --org sanyasandal --repo signat-figma-migration --branch reskin --path $path --namespace reskin 2>&1 | grep -oE "^(PASS|FAIL)[^h]*" | head -1)
ct=$(node stardust/scripts/reskin/deployed-gate.mjs content --page $slug 2>&1 | tr '\n' ' ' | grep -oE "(PASS|FAIL) content.{0,180}")
echo "$slug | preview $pv | $ct"
