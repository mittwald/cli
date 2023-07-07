#!/bin/bash

# Remove 'de.mittwald.v1.' from start of keys
jq_keys='
  walk(
    if type == "object" then with_entries(
      .key = (.key | sub("^de.mittwald.v1."; ""))
    ) else . end
  )
'

# Remove 'de.mittwald.v1.' from any $ref
jq_values='
  walk(
    if type == "object" then with_entries(
      .value = (
        if (.value | type == "string") and .key == "$ref"
        then (.value | sub("de.mittwald.v1."; ""))
        else .value
        end
      )
    ) else . end
  )
'

jq "$jq_keys" | jq "$jq_values"
