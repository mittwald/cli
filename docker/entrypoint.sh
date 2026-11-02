#!/bin/sh
set -e

if [ -z "${MW_UID:-}" ]; then
  exec /app/mw/bin/mw "$@"
fi

mw_gid="${MW_GID:-$MW_UID}"

require_numeric_id() {
  case "$2" in
    '' | *[!0-9]*)
      echo "mw-entrypoint: $1 must be a numeric ID, got '$2'" >&2
      exit 1
      ;;
  esac
}

require_numeric_id MW_UID "$MW_UID"
require_numeric_id MW_GID "$mw_gid"

groupmod --non-unique --gid "$mw_gid" mw > /dev/null
usermod --non-unique --uid "$MW_UID" --gid "$mw_gid" mw > /dev/null

export HOME=/home/mw
exec setpriv --reuid="$MW_UID" --regid="$mw_gid" --init-groups /app/mw/bin/mw "$@"
