# Task 13: Add Prettier Configuration

## Priority: Medium
## Area: Developer Experience

## Summary

Add Prettier for consistent code formatting across the project. Currently only ESLint is configured, which handles logic rules but not formatting consistency.

## Requirements

### Install

```
prettier
eslint-config-prettier (to disable ESLint formatting rules that conflict)
```

### Configuration

Create `.prettierrc` with reasonable defaults:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Create `.prettierignore`:
```
dist
node_modules
package-lock.json
*.mf
```

### Integration

- Add `"format": "prettier --write src/"` script to package.json
- Add `"format:check": "prettier --check src/"` script for CI
- Update ESLint config to include `eslint-config-prettier`
- Run initial format pass on codebase

### CI Integration

- Add format check step to GitHub Actions workflow (Task 11)

## Acceptance Criteria

- [ ] Prettier installed and configured
- [ ] `.prettierrc` exists with project conventions
- [ ] `.prettierignore` excludes appropriate files
- [ ] `npm run format` works
- [ ] `npm run format:check` works (for CI)
- [ ] ESLint and Prettier don't conflict
- [ ] Existing code formatted consistently

## Notes

- Run Prettier on the entire codebase as a single formatting commit before any other changes
- `.mf` files (markframe DSL) should be excluded from Prettier
