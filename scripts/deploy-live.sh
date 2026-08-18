#!/usr/bin/env bash
# Push NCA Store to GitHub and deploy to Vercel
# Usage: ./scripts/deploy-live.sh krwao nca-store

set -euo pipefail
GITHUB_USER="${1:-krwao}"
REPO_NAME="${2:-nca-store}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> GitHub target: $GITHUB_USER/$REPO_NAME"

command -v gh >/dev/null || { echo "Install GitHub CLI: https://cli.github.com"; exit 1; }
gh auth status || { echo "Run: gh auth login"; exit 1; }

if ! gh repo view "$GITHUB_USER/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$GITHUB_USER/$REPO_NAME" --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || \
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
  git push -u origin main
fi

echo "==> Pushed: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "==> Deploying to Vercel (run vercel login first if needed)..."
npx vercel --prod

echo "==> Set NEXT_PUBLIC_APP_URL in Vercel, then update Supabase auth redirect URLs."
