#!/usr/bin/env bats

bats_require_minimum_version 1.5.0

IMAGE="${MW_IMAGE:-mittwald/cli:testing}"

teardown() {
  if [ -n "${container:-}" ]; then
    docker logs "$container"
    docker rm -f "$container" > /dev/null
  fi
}

# "login token" keeps the CLI running while it waits for input.
start_waiting_cli() {
  container=$(docker run -d -it "$@" "$IMAGE" login token)
  for _ in $(seq 1 40); do
    docker logs "$container" 2>&1 | grep -q "Enter your mStudio API token" && return 0
    sleep 0.5
  done

  return 1
}

cli_process_owner() {
  docker top "$container" -o pid,uid,gid,comm | awk '$4 == "node" { print $2 ":" $3; exit }'
}

@test "prints the help" {
  run docker run --rm "$IMAGE" --help
  [ "$status" -eq 0 ]
}

@test "ships the ssh tooling" {
  run docker run --rm --entrypoint sh "$IMAGE" -ec '
    for binary in ssh scp ssh-keygen rsync; do command -v "$binary"; done
  '
  [ "$status" -eq 0 ]
}

@test "lets ssh port forwardings bind to the container interface" {
  run docker run --rm --entrypoint ssh "$IMAGE" -G example.invalid
  [ "$status" -eq 0 ]
  [[ "$output" == *"gatewayports yes"* ]]
}

@test "runs as root without MW_UID" {
  start_waiting_cli
  [ "$(cli_process_owner)" = "0:0" ]
}

@test "runs as MW_UID and MW_GID" {
  start_waiting_cli -e MW_UID=1234 -e MW_GID=2345
  [ "$(cli_process_owner)" = "1234:2345" ]
}

@test "uses MW_UID as group ID without MW_GID" {
  start_waiting_cli -e MW_UID=1234
  [ "$(cli_process_owner)" = "1234:1234" ]
}

@test "accepts an MW_GID that already belongs to another group" {
  start_waiting_cli -e MW_UID=1234 -e MW_GID=100
  [ "$(cli_process_owner)" = "1234:100" ]
}

@test "keeps stdout clean when MW_UID matches the mw user" {
  mw_uid=$(docker run --rm --entrypoint id "$IMAGE" -u mw)
  run --separate-stderr docker run --rm -e MW_UID="$mw_uid" "$IMAGE" --version
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 1 ]
}

@test "rejects a non-numeric MW_UID" {
  run docker run --rm -e MW_UID=nobody "$IMAGE" --version
  [ "$status" -eq 1 ]
  [ "$output" = "mw-entrypoint: MW_UID must be a numeric ID, got 'nobody'" ]
}

@test "terminates on docker stop as root" {
  start_waiting_cli
  docker stop --time 10 "$container" > /dev/null
  [ "$(docker inspect --format '{{.State.ExitCode}}' "$container")" -eq 143 ]
}

@test "terminates on docker stop with MW_UID" {
  start_waiting_cli -e MW_UID=1234
  docker stop --time 10 "$container" > /dev/null
  [ "$(docker inspect --format '{{.State.ExitCode}}' "$container")" -eq 143 ]
}

@test "stays quiet when started with docker run --init" {
  run --separate-stderr docker run --rm --init "$IMAGE" --version
  [ "$status" -eq 0 ]
  [ -z "$stderr" ]
}
