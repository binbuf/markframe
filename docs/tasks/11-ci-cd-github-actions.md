# Task 11: CI/CD with GitHub Actions

## Priority: Critical (Blocking)
## Area: DevOps

## Summary

Set up GitHub Actions workflows for automated quality checks on every push and pull request. No CI/CD currently exists.

## Requirements

### Workflow: `ci.yml`

Triggers: push to `main`, pull requests to `main`

**Jobs:**

1. **lint** — Run ESLint
   ```
   npm ci
   npm run lint
   ```

2. **typecheck** — Run TypeScript compiler
   ```
   npm ci
   npx tsc -b --noEmit
   ```

3. **test** — Run Vitest (after Task 01 is complete)
   ```
   npm ci
   npm test
   ```

4. **build** — Verify production build succeeds
   ```
   npm ci
   npm run build
   ```

### Configuration

- Use Node.js 18.x and 20.x matrix
- Cache node_modules via actions/cache or actions/setup-node cache
- Jobs should run in parallel where independent
- Fail fast on any job failure

### Optional: Deploy Preview

- Consider GitHub Pages deployment for `main` branch
- Or Vercel/Netlify preview deploys for PRs

## Acceptance Criteria

- [ ] `.github/workflows/ci.yml` exists
- [ ] Lint, typecheck, and build jobs pass on current code
- [ ] Test job configured (will pass once tests exist)
- [ ] Workflow runs on push to main and PRs
- [ ] Node version matrix (18.x, 20.x)
- [ ] Badge added to README showing CI status

## Notes

- Build currently uses `tsc -b && vite build` which does both typecheck and build
- Consider splitting typecheck into its own job for faster feedback
- The rolldown-vite override in package.json may need attention in CI
