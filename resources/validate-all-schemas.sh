#!/bin/bash

find ./schemas -type d -print0 | while read -d $'\0' dir
do
    for file in "$dir"/*; do
        if [[ -f $file && $file == *.json ]]; then
            npm run validate-json-schema $file || exit 1
        elif [[ -d $file ]]; then
            echo "$file is a directory. Skipping.."
            continue;
        else
            echo "$file is not valid!"
            echo "./schemas must only contain valid JSON schemas as '.json' files!"
            exit 1
        fi

    done
done