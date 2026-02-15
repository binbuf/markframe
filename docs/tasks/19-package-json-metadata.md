# Task 19: Package.json Metadata for Public Release

## Priority: Medium
## Area: Release Preparation

## Summary

Update package.json with complete metadata fields required for a public project. Currently minimal with only scripts and dependencies.

## Current State

package.json has:
- name, private, version, type, scripts, dependencies, devDependencies, overrides
- Missing: description, author, license, repository, homepage, keywords, bugs, engines

## Requirements

Add the following fields:

```json
{
  "description": "Mermaid-for-UI — build mobile interfaces with a declarative DSL and get real-time iOS & Android previews",
  "author": "<author name>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/<user>/markframe.git"
  },
  "homepage": "https://github.com/<user>/markframe",
  "bugs": {
    "url": "https://github.com/<user>/markframe/issues"
  },
  "keywords": [
    "ui",
    "mobile",
    "prototyping",
    "ios",
    "android",
    "dsl",
    "design",
    "wireframe",
    "mockup",
    "react"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Acceptance Criteria

- [ ] All metadata fields populated
- [ ] `license` matches LICENSE file
- [ ] `engines` matches documented Node.js requirement
- [ ] `repository` and `homepage` URLs are correct
- [ ] `keywords` are relevant and discoverable

## Notes

- Keep `"private": true` if not publishing to npm
- Remove `"private": true` only if intentionally publishing as npm package
