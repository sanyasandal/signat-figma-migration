#!/bin/bash
# Phase 2 for content-type siblings: same scope and N3 accordion ledger as the archetype.
slug=$1; url=$2
[ -f stardust/reskin/normalize/$slug.mjs ] || echo "export { LEDGER, NORMALIZE } from './_content.mjs';" > stardust/reskin/normalize/$slug.mjs
node stardust/scripts/reskin/capture-content.mjs --url "$url" --scope 'nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!' \
  --normalize stardust/reskin/normalize/$slug.mjs --out stardust/reskin/content-model/$slug/ > stardust/.work/reskin/capture-$slug.log 2>&1
echo "$slug exit=$? $(grep -E 'slots=|coverage:|WARNING|residue \(' stardust/.work/reskin/capture-$slug.log | tr '\n' ' ' | cut -c1-260)"
