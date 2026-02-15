# Task 09: Add CONTRIBUTING.md

## Priority: High
## Area: Community

## Summary

Create a CONTRIBUTING.md that explains how to contribute to the project. Essential for a community public release.

## Requirements

### Content Sections

1. **Welcome / Introduction** — Brief welcome, what kind of contributions are wanted
2. **Getting Started**
   - Prerequisites (Node.js v18+)
   - Fork & clone instructions
   - `npm install` + `npm run dev` setup
   - Project structure overview
3. **Development Workflow**
   - Branch naming conventions
   - How to run tests (`npm test`)
   - How to lint (`npm run lint`)
   - How to build (`npm run build`)
4. **The Markframe Language**
   - Link to Language Specification doc
   - How to add new components to the catalog
   - Parser overview for contributors
5. **Submitting Changes**
   - PR process
   - Commit message conventions
   - What makes a good PR
6. **Adding New Widgets**
   - Step-by-step guide: create component file, register in catalog, add to language spec
   - Follow existing patterns (ComponentProps interface, displayName)
7. **Bug Reports & Feature Requests**
   - How to file good issues
   - What information to include
8. **Code Style**
   - TypeScript strict mode
   - ESLint rules
   - Follow existing patterns

## Acceptance Criteria

- [ ] CONTRIBUTING.md exists at project root
- [ ] Covers all sections above
- [ ] Links to relevant docs (Language Spec, Design.md)
- [ ] Tone is welcoming and clear
