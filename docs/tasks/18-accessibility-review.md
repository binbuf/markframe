# Task 18: Accessibility Review

## Priority: Medium
## Area: Quality / Compliance

## Summary

Review the application for accessibility compliance. The UIUX.md mentions WCAG AA as a target. Verify the editor UI (not the previewed mobile UIs) meets this standard.

## Scope

**In Scope:** The markframe editor application itself — toolbar, editor pane, device preview, welcome screen, dialogs, validation panel.

**Out of Scope:** The rendered mobile UI previews (these are mockups, not functional apps).

## Audit Areas

### 1. Keyboard Navigation
- All toolbar buttons keyboard-accessible
- Tab order is logical
- Focus indicators visible
- Keyboard shortcuts don't conflict with screen readers
- ShortcutsDialog keyboard-accessible

### 2. Screen Reader Support
- Toolbar buttons have aria-labels
- Device preview has aria description
- Validation panel errors announced
- Editor pane labeled (Monaco has built-in a11y)

### 3. Color Contrast
- Toolbar icons/text meet 4.5:1 contrast ratio
- Validation errors/warnings readable
- Focus indicators visible against background
- Welcome screen text readable

### 4. Motion & Animation
- Respects `prefers-reduced-motion`
- No auto-playing animations that can't be paused

### 5. Responsive / Zoom
- Editor usable at 200% browser zoom
- Text doesn't overflow at large font sizes

## Acceptance Criteria

- [ ] All interactive elements keyboard-accessible
- [ ] ARIA labels on toolbar buttons and key UI elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus indicators visible throughout
- [ ] No accessibility violations from automated audit (axe-core)

## Key Files

- `src/components/Toolbar.tsx`
- `src/components/ValidationPanel.tsx`
- `src/components/ShortcutsDialog.tsx`
- `src/views/EditorPane.tsx`
- `src/views/DevicePreview.tsx`
- `src/views/WelcomeScreen.tsx`
- `src/App.tsx`
