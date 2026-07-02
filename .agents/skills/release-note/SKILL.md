---
name: release-note
description:
  Write a user-facing Discord release announcement for the mittwald CLI (command
  `mw`) from a git commit log and code diff. Trigger when asked to generate,
  summarize, or write a release note/announcement for a release tag.
---

# Release note

Write a short, friendly release announcement for the **mittwald CLI** (the `mw`
command), suitable for posting in a Discord channel aimed at users of the CLI.

## Determining what changed

You are given a release **tag** (e.g. `v1.20.0`). You run inside a full checkout
of the repository, so all tags and history are available. Collect the commit log
and the code diff for everything since the previous stable minor/major release
by running this in the repository root:

```bash
TAG="<the release tag you were given>"

# All stable minor/major tags (patch == 0), sorted ascending by version.
MINORS=$(git tag --list 'v*' | grep -E '^v[0-9]+\.[0-9]+\.0$' | sort -V)

# The stable minor tag immediately preceding TAG (empty if TAG is the first one).
PREV=$(echo "$MINORS" | grep -B1 -x "$TAG" | grep -v -x "$TAG" | tail -1)

# Range to diff: previous minor..current, or just TAG if there is no predecessor.
if [[ -z "$PREV" ]]; then RANGE="$TAG"; else RANGE="$PREV..$TAG"; fi

# Commit log — for orientation only.
git log --no-merges --pretty=format:'- %s (%h)' $RANGE > changes.txt

# The actual code diff. Exclude generated docs and lockfiles (they are noise),
# and cap the size so it stays within the model's context window.
git diff --stat $RANGE -- \
  ':(exclude)docs/**' ':(exclude)**/*.lock' \
  ':(exclude)yarn.lock' ':(exclude)package-lock.json' > diff.txt
echo "" >> diff.txt
git diff $RANGE -- \
  ':(exclude)docs/**' ':(exclude)**/*.lock' \
  ':(exclude)yarn.lock' ':(exclude)package-lock.json' >> diff.txt
head -c 200000 diff.txt > diff.trimmed.txt && mv diff.trimmed.txt diff.txt
```

Then read `changes.txt` and `diff.txt`. **Base the release note on what the diff
actually changes**, not merely on what the commit subjects claim; use the commit
log only for orientation / grouping.

## Rules for the note

- Use GitHub-flavored Markdown and a few tasteful emoji.
- Group related changes into a handful of bullet points; focus on user-facing
  highlights.
- Mention affected command names in the form `mw <group> <command>` explicitly,
  wherever the diff makes them clear.
- Skip pure dependency bumps, chores and internal refactors unless notable.
- No preamble and no heading with the version number (a heading is added
  separately by the publishing step).
- Keep it under ~1200 characters.

## Output

Write **only** the finished release note to a file named `note.md` in the
current working directory, using your file-writing tool.

The content of `note.md` is the sole deliverable. Anything you say in the chat
is discarded, and any stray text in `note.md` will be posted verbatim to
Discord.
