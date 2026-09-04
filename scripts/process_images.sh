#!/bin/bash
set -e

SRC="/Volumes/Slow 2Tb/############## photography/for portfolio"
DEST="/Users/masonle/Documents/code/creativePortfolio/images"

process_one() {
  local srcfile="$1"
  local cat="$2"
  local base
  base=$(basename "$srcfile")
  base="${base%.*}"
  base=$(echo "$base" | tr '[:upper:]' '[:lower:]' | tr -d '_')
  local thumb="$DEST/thumbs/$cat/${base}.jpg"
  local full="$DEST/full/$cat/${base}.jpg"

  if [ ! -f "$full" ]; then
    sips -s format jpeg -Z 2000 -s formatOptions 82 "$srcfile" --out "$full" >/dev/null 2>&1
  fi
  if [ ! -f "$thumb" ]; then
    sips -s format jpeg -Z 900 -s formatOptions 72 "$srcfile" --out "$thumb" >/dev/null 2>&1
  fi
  echo "$cat/$base"
}
export -f process_one
export DEST

process_category() {
  local cat="$1"
  local dir="$2"
  find "$dir" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 \
    | xargs -0 -n1 -P 8 -I{} bash -c 'process_one "$1" "$2"' _ {} "$cat"
}
export -f process_category

process_category cars "$SRC/cars"
process_category landscape "$SRC/landscape"
process_category portrait "$SRC/portrait"
process_category products "$SRC/products"
process_category sports "$SRC/sports"
process_category street "$SRC/street"
process_category cuba "$SRC/cuba/JPEG"

echo "DONE"
