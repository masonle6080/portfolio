#!/bin/bash
cd /Users/masonle/Documents/code/creativePortfolio/images/thumbs

cats=(cuba street landscape portrait sports cars)
labels=("Cuba" "Street" "Landscape" "Portrait" "Sports" "Cars")

out="/Users/masonle/Documents/code/creativePortfolio/js/data.js"
echo "const PORTFOLIO_DATA = {" > "$out"
echo "  categories: [" >> "$out"

n=${#cats[@]}
for ((i=0; i<n; i++)); do
  c="${cats[$i]}"
  label="${labels[$i]}"
  echo "    {" >> "$out"
  echo "      slug: \"$c\"," >> "$out"
  echo "      label: \"$label\"," >> "$out"
  echo "      images: [" >> "$out"
  for f in $(ls "$c" | sed 's/\.jpg$//' | sort); do
    echo "        \"$f\"," >> "$out"
  done
  echo "      ]" >> "$out"
  if [ "$i" -lt "$((n-1))" ]; then
    echo "    }," >> "$out"
  else
    echo "    }" >> "$out"
  fi
done

echo "  ]" >> "$out"
echo "};" >> "$out"
