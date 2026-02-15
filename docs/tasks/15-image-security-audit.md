# Task 15: Security Audit — Input Sanitization

## Priority: High
## Area: Security

## Summary

Audit and harden all user-input handling paths. The application processes user-authored DSL text and renders it as UI. Ensure no XSS, injection, or other security issues exist.

## Current State

- KImage already blocks `javascript:` and `data:text/html` protocols (good)
- Smart asset resolution exists for images/avatars
- Monaco editor handles text input
- No known server-side code (client-only SPA)

## Audit Areas

### 1. URL/Src Sanitization
- Verify KImage protocol blocking is comprehensive
- Check KAvatar src handling
- Check KMediaCard image prop
- Check KPost image prop
- Check any other component accepting URLs
- Ensure `data:image/*` is allowed but `data:text/html` is blocked

### 2. Text Content Rendering
- Verify text props are rendered safely (no dangerouslySetInnerHTML)
- Check KText newline-to-`<br>` conversion for injection
- Check KMessage text rendering
- Check KPost text rendering

### 3. CSS Injection
- Check className prop passthrough (can users inject arbitrary CSS?)
- Check inline style generation from props
- Check color prop handling (do arbitrary values get injected into styles?)

### 4. File System Access
- Review `src/api/fileAccess.ts` for path traversal risks
- Verify File System Access API usage follows browser security model

### 5. Monaco Editor
- Verify no eval() or Function() on user input
- Check custom syntax highlighting for injection vectors

## Acceptance Criteria

- [ ] All URL-accepting props sanitized consistently
- [ ] No dangerouslySetInnerHTML usage (or justified if present)
- [ ] className passthrough cannot execute scripts
- [ ] File access limited to browser sandbox
- [ ] Security findings documented and fixed
- [ ] No OWASP Top 10 vulnerabilities

## Key Files

- `src/catalog/KImage.tsx`
- `src/catalog/KAvatar.tsx`
- `src/catalog/KMediaCard.tsx`
- `src/catalog/KPost.tsx`
- `src/catalog/KText.tsx`
- `src/catalog/KMessage.tsx`
- `src/api/fileAccess.ts`
- `src/utils/smartAssets.ts`
