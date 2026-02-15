# Task 17: Blueprint Validation & Completeness

## Priority: Medium
## Area: Quality Assurance

## Summary

Validate all 21 blueprint files parse correctly, render without errors, and collectively demonstrate all major features. Blueprints are the first thing users will interact with — they must be flawless.

## Current State

- 21 blueprint .mf files in /blueprints/
- No automated validation that blueprints parse correctly
- No verification that blueprints cover all component types
- Blueprint registry in src/blueprints.ts may not match actual files

## Requirements

### 1. Parse Validation
- Every .mf file parses without errors or warnings
- All component types used in blueprints exist in the catalog
- All navigation targets reference valid view names
- All overlay targets reference valid overlay IDs

### 2. Registry Sync
- Verify `src/blueprints.ts` lists all files in `blueprints/` directory
- Verify all entries in registry have matching .mf files
- Names, descriptions, and categories are accurate

### 3. Coverage Analysis
- Document which component types appear in blueprints
- Identify component types NOT demonstrated in any blueprint
- Create new blueprints or extend existing ones to cover gaps

### 4. Quality Review
- Each blueprint should be a realistic, useful starting point
- No lorem ipsum or placeholder text (use realistic content)
- Consistent style and complexity across blueprints
- Each blueprint demonstrates a distinct use case

### 5. Automated Blueprint Tests
- Write a test that loads and parses every .mf file
- Assert zero parse errors
- Assert zero validation warnings
- This becomes a regression test for parser changes

## Acceptance Criteria

- [ ] All 21 blueprints parse with zero errors
- [ ] Blueprint registry matches filesystem
- [ ] Component coverage gaps identified and addressed
- [ ] Blueprint test suite created (as part of Task 07)
- [ ] Each blueprint reviewed for realism and quality
