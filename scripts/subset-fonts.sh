#!/usr/bin/env bash
# Rebuilds the self-hosted WOFF2 subsets in styles/fonts/ (Latin + Georgian).
#
# Usage: scripts/subset-fonts.sh <dir with source TTFs>
#   Expects FiraGO-Regular.ttf, FiraGO-Medium.ttf,
#   NotoSerifGeorgian[wdth,wght].ttf and CormorantGaramond[wght].ttf.
# Requires: pip install fonttools brotli
set -euo pipefail
SRC="${1:?source font directory}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/styles/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

LATIN="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+0160-0161,U+0178,U+017D-017E,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215"
GEORGIAN="U+10A0-10FF,U+1C90-1CBF"
PUNCT="U+0020-0040,U+005B-0060,U+007B-007E,U+00A0,U+00A9,U+00AB,U+00AE,U+00B0,U+00B7,U+00BB,U+00D7,U+2010-2027,U+2030,U+2039-203A,U+2116,U+2122,U+2212"
FEATURES="kern,liga,calt,ccmp,locl,mark,mkmk,tnum,lnum,pnum,case,frac,numr,dnom"
subset() { pyftsubset "$1" --unicodes="$2" --layout-features="$FEATURES" --no-hinting --desubroutinize --flavor=woff2 --output-file="$3"; }

# Body: FiraGO covers Latin, Georgian and the Lari sign.
subset "$SRC/FiraGO-Regular.ttf" "$LATIN,$GEORGIAN,U+20BE" "$OUT/firago-regular.woff2"
subset "$SRC/FiraGO-Medium.ttf" "$LATIN,$GEORGIAN,U+20BE" "$OUT/firago-medium.woff2"

# Display: static 600 instances. Noto keeps Georgian + punctuation only, so Latin falls through to Cormorant.
fonttools varLib.instancer "$SRC/NotoSerifGeorgian[wdth,wght].ttf" wght=600 wdth=100 --static -o "$TMP/nsg.ttf"
subset "$TMP/nsg.ttf" "$GEORGIAN,$PUNCT,U+20BE" "$OUT/noto-serif-georgian-600.woff2"
fonttools varLib.instancer "$SRC/CormorantGaramond[wght].ttf" wght=600 --static -o "$TMP/cg.ttf"
subset "$TMP/cg.ttf" "$LATIN" "$OUT/cormorant-garamond-600.woff2"

ls -la "$OUT"/*.woff2
