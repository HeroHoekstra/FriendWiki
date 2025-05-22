#!/bin/bash
SRC_DIR="wwwroot/stylus/scoped"
DEST_DIR="Views"

find "$SRC_DIR" -name '*.styl' | while read -r file; do
  rel_path="${file#"$SRC_DIR"/}"
  out_path="$DEST_DIR/${rel_path%.styl}.css"
  out_path="${out_path%.css}.cshtml.css"
  
  mkdir -p "$(dirname "$out_path")"
  
  stylus "$file" -o "$out_path"
done