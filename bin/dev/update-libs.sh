#!/bin/bash

# Update all project dependencies
set -e

WORKSPACE_ROOT="${WORKSPACE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

cd "$WORKSPACE_ROOT"

(
    npm install -g @anthropic-ai/claude-code @google/gemini-cli @github/copilot @openai/codex @biomejs/biome
) &
NPM_PID=$!

(
    npm update
) &
APP_PID=$!

(
    npx skills update
) &
SKILLS_PID=$!

echo "Waiting for updates to complete..."
wait $NPM_PID && echo "✓ Global npm tools updated"
wait $APP_PID && echo "✓ App dependencies updated"
wait $SKILLS_PID && echo "✓ Skills updated"
