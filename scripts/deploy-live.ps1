# Push NCA Store to GitHub and deploy to Vercel
#
# Prerequisites (run once):
#   gh auth login
#   npx vercel login
#
# Usage:
#   .\scripts\deploy-live.ps1 -GitHubUser krwao
#   .\scripts\deploy-live.ps1 -GitHubUser freetrial00851-prog -RepoName nca-store

param(
  [Parameter(Mandatory = $false)]
  [string]$GitHubUser = "krwao",

  [Parameter(Mandatory = $false)]
  [string]$RepoName = "nca-store",

  [Parameter(Mandatory = $false)]
  [string]$AppUrl = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

Write-Host "==> NCA Store — GitHub + Vercel deploy" -ForegroundColor Cyan
Write-Host "    GitHub target: $GitHubUser/$RepoName"

# --- GitHub CLI ---
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI not found. Install: winget install GitHub.cli"
}

$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Error "Not logged into GitHub. Run: gh auth login"
}

# --- Create repo if missing ---
$repoExists = gh repo view "$GitHubUser/$RepoName" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "==> Creating GitHub repo $GitHubUser/$RepoName ..."
  gh repo create "$GitHubUser/$RepoName" --public --source=. --remote=origin --push
} else {
  Write-Host "==> Repo exists. Ensuring remote and pushing ..."
  $remotes = git remote
  if ($remotes -notcontains "origin") {
    git remote add origin "https://github.com/$GitHubUser/$RepoName.git"
  }
  git push -u origin main
}

Write-Host "==> GitHub push complete: https://github.com/$GitHubUser/$RepoName" -ForegroundColor Green

# --- Vercel ---
Write-Host ""
Write-Host "==> Deploying to Vercel ..."
Write-Host "    Add these env vars in Vercel dashboard (or when prompted):"
Write-Host "      NEXT_PUBLIC_SUPABASE_URL"
Write-Host "      NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "      SUPABASE_SERVICE_ROLE_KEY"
Write-Host "      NEXT_PUBLIC_APP_URL  (set after first deploy to your .vercel.app URL)"
Write-Host ""

npx vercel --prod

if ($AppUrl) {
  Write-Host ""
  Write-Host "==> After deploy, update Supabase Auth URLs to: $AppUrl" -ForegroundColor Yellow
} else {
  Write-Host ""
  Write-Host "==> Next steps:" -ForegroundColor Yellow
  Write-Host "    1. Copy your Vercel URL from the output above"
  Write-Host "    2. Set NEXT_PUBLIC_APP_URL in Vercel → Settings → Environment Variables"
  Write-Host "    3. Redeploy (Vercel → Deployments → Redeploy)"
  Write-Host "    4. Supabase → Authentication → URL Configuration:"
  Write-Host "         Site URL = your Vercel URL"
  Write-Host "         Redirect URLs = your Vercel URL/**"
}
