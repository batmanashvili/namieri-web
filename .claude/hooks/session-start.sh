#!/bin/bash
# Claude Code cloud sessions only: install JS dependencies and the Graphify CLI,
# then build the codebase knowledge graph (graphify-out/, AST-only, ~3 s, no API key).
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# --- JavaScript dependencies (pnpm version comes from package.json "packageManager") ---
corepack enable >/dev/null 2>&1 || true
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install --prefer-offline >&2

# --- Graphify, pinned to the version of the committed skill ---
export PATH="$HOME/.local/bin:$PATH"
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

GRAPHIFY_VERSION="$(cat .claude/skills/graphify/.graphify_version)"
installed="$(graphify --version 2>/dev/null | awk '{print $2}' || true)"
if [ "$installed" != "$GRAPHIFY_VERSION" ]; then
  if command -v uv >/dev/null 2>&1; then
    uv tool install --force "graphifyy==${GRAPHIFY_VERSION}" >&2 || echo "graphify: install failed, continuing without it" >&2
  elif command -v pipx >/dev/null 2>&1; then
    pipx install --force "graphifyy==${GRAPHIFY_VERSION}" >&2 || echo "graphify: install failed, continuing without it" >&2
  else
    echo "graphify: neither uv nor pipx found, skipping" >&2
  fi
fi

# Build or refresh the graph. Never block the session on it.
if command -v graphify >/dev/null 2>&1; then
  graphify update . >&2 || echo "graphify: graph build failed, continuing" >&2
fi
