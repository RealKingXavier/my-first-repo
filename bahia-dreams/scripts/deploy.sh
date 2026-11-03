#!/usr/bin/env bash
# Production deploy to Netlify.
#
# This folder lives inside a larger git repository, and the Netlify CLI treats
# that repository's root as the project root — which drops the Next.js server
# function's routes and makes every page 404. Building from a clean copy outside
# any git repo avoids that. Usage:  ./scripts/deploy.sh   (add --draft for a preview)
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d -t bahia-deploy)"
trap 'rm -rf "$WORK"' EXIT

rsync -a --exclude node_modules --exclude .next --exclude .netlify --exclude .data --exclude '*.tsbuildinfo' "$SRC/" "$WORK/"
mkdir -p "$WORK/.netlify" && cp "$SRC/.netlify/state.json" "$WORK/.netlify/"
cd "$WORK"
npm ci --no-audit --no-fund

if [[ "${1:-}" == "--draft" ]]; then
  netlify deploy --build --skip-functions-cache
else
  netlify deploy --build --prod --skip-functions-cache
fi
