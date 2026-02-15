# Task 14: Parser Error Handling & Recovery

## Priority: High
## Area: Code Quality

## Summary

Improve the parser's error handling and recovery so that malformed input produces helpful error messages rather than crashes or silent failures. Currently, unrecognized characters are skipped with warnings, but there's no structured error reporting.

## Current State

- Parser skips unrecognized characters with internal warnings
- No structured error/warning collection returned to caller
- ErrorBoundary catches React render crashes but not parse-time issues
- ValidationPanel exists but may not receive all parser warnings

## Requirements

### Parser Error Collection
- Return structured errors/warnings alongside parsed nodes
- Each error should include: line number, column, message, severity (error/warning)
- Errors for: invalid syntax, unclosed quotes, malformed arrays
- Warnings for: unrecognized props, deprecated syntax, unusual patterns

### Graceful Degradation
- Parser should never throw on malformed input
- Partial results returned even when errors exist
- Invalid lines skipped with error recorded (not silent drop)

### Error Display
- ValidationPanel should display parser-returned errors
- Errors should be clickable to jump to line in editor
- Distinguish between errors (red) and warnings (yellow)

## Acceptance Criteria

- [ ] Parser returns `{ nodes, errors, warnings }` structure
- [ ] All parse failures produce a user-readable error message
- [ ] Line numbers included in all error messages
- [ ] No input string can crash the parser (fuzz-test resilient)
- [ ] ValidationPanel shows parser errors with line numbers
- [ ] Tests cover all error paths (Task 02 extended)

## Key Files

- `src/engine/markframeParser.ts`
- `src/components/ValidationPanel.tsx`
- `src/engine/usemarkframe.ts`
