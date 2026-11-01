#!/bin/sh
set -e

if [ -z "${MW_UID:-}" ]; then
  exec /app/mw/bin/mw "$@"
fi

mw_gid="${MW_GID:-$MW_UID}"
groupmod --non-unique --gid "$mw_gid" mw
usermod --non-unique --uid "$MW_UID" --gid "$mw_gid" mw

export HOME=/home/mw
exec setpriv --reuid="$MW_UID" --regid="$mw_gid" --init-groups /app/mw/bin/mw "$@"
