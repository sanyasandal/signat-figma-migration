#!/bin/bash
# Phase 4 for siblings, sequential (each --register rewrites state.json).
for s in "$@"; do
  node stardust/reskin/renderers/stream.mjs $s --localize-images --register --type content > stardust/.work/reskin/render-$s.log 2>&1
  echo "$s exit=$? $(grep -E 'registered' stardust/.work/reskin/render-$s.log | cut -c1-140)"
done
