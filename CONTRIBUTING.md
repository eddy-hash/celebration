# Contributing

## Golden Rule

Always work from `~/SaaS/celebration/`:

    cd ~/SaaS/celebration
    pwd              # → /home/mr_discipline/SaaS/celebration
    git status       # → clean tree

## Bug-Fix Workflow

### 1. Reset environment
    cd ~/SaaS/celebration
    ./scripts/dev-reset.sh

### 2. Start servers
    # Terminal 1 — Backend
    cd ~/SaaS/celebration/Backend && npm run start:dev

    # Terminal 2 — Frontend
    cd ~/SaaS/celebration/Frontend && npm run dev

### 3. Clear browser
Hard refresh: Ctrl + Shift + R
If auth bug, DevTools console: localStorage.clear(); location.reload();

### 4. Still broken? Read TROUBLESHOOTING.md

## Making Changes

    cd ~/SaaS/celebration
    git checkout -b fix/your-fix
    # make changes
    git add -A
    git commit -m "fix(scope): description"
    git push origin fix/your-fix

## Commit Types
feat · fix · docs · style · refactor · test · chore

## Don't Commit
.env · node_modules/ · .next/ · dist/ · *.sqlite · uploads/*

## Contact
- 0710 209 220
- 0692 506 552
