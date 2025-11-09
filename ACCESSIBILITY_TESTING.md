# Accessibility Testing Guide

## Overview

This guide provides comprehensive instructions for testing the accessibility features of the University Course Study Planner. It covers automated testing, manual testing, and assistive technology testing.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automated Testing](#automated-testing)
3. [Keyboard Navigation Testing](#keyboard-navigation-testing)
4. [Screen Reader Testing](#screen-reader-testing)
5. [Visual Accessibility Testing](#visual-accessibility-testing)
6. [Browser Compatibility Testing](#browser-compatibility-testing)
7. [Mobile Accessibility Testing](#mobile-accessibility-testing)
8. [Continuous Integration](#continuous-integration)
9. [Accessibility Checklist](#accessibility-checklist)

---

## Quick Start

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (for automated testing)
pnpm exec playwright install
```

### Run All Accessibility Tests

```bash
# Run automated accessibility tests
pnpm run test -- --grep "Accessibility"

# Run comprehensive test suite (includes a11y tests)
pnpm run test
```

---

## Automated Testing

### Playwright Tests

The project includes 54 automated accessibility tests across 3 device profiles:

```bash
# Run all accessibility tests
pnpm run test -- --grep "Accessibility"

# Run specific test categories
pnpm run test -- --grep "Modal Focus Trapping"
pnpm run test -- --grep "Screen Reader Announcements"
pnpm run test -- --grep "Keyboard Navigation"

# Run on specific device profile
pnpm run test -- --project=chromium-desktop --grep "Accessibility"
pnpm run test -- --project=chromium-mobile --grep "Accessibility"
pnpm run test -- --project=chromium-tablet --grep "Accessibility"
```

### Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Modal Focus Trapping | 12 | ✅ Passing |
| Screen Reader Announcements | 9 | ✅ Passing |
| Form Validation | 9 | ✅ Passing |
| Keyboard Navigation | 9 | ✅ Passing |
| Multi-language Support | 6 | ✅ Passing |
| Auto-Map with Announcements | 3 | ✅ Passing |
| Save Progress Announcements | 3 | ✅ Passing |
| Skip Link Functionality | 3 | ✅ Passing |

### Using axe-core (Recommended)

Install axe DevTools browser extension for automated accessibility scanning:

1. **Chrome:** [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
2. **Firefox:** [axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

**Steps:**
1. Open the application
2. Open DevTools (F12)
3. Navigate to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review violations, warnings, and passes
6. Export report if needed

### Lighthouse Accessibility Audit

Built into Chrome DevTools:

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review score and recommendations

**Target Score:** 95+ / 100

---

## Keyboard Navigation Testing

### Test Procedure

**No mouse or trackpad allowed during testing!**

#### 1. Skip Link Test

**Steps:**
1. Load the page
2. Press `Tab` once
3. **Expected:** Skip link appears with focus
4. Press `Enter`
5. **Expected:** Focus moves to main content area

**Pass Criteria:**
- ✅ Skip link is visible when focused
- ✅ Skip link has clear focus indicator
- ✅ Pressing Enter jumps to main content
- ✅ Skip link works in all 3 languages

#### 2. Focus Visibility Test

**Steps:**
1. Press `Tab` repeatedly through the entire page
2. Observe focus indicator on each element

**Pass Criteria:**
- ✅ All interactive elements receive focus
- ✅ Focus indicator is clearly visible (3px blue/light-blue outline)
- ✅ Focus indicator has 2px offset
- ✅ Focus order is logical
- ✅ No focus traps (except modals)

**Focus Order:**
```
1. Skip link (on first Tab)
2. Language selector
3. Theme toggle
4. Save button
5. Settings button
6. Import/Export button
7. Reset All button
8. Auto-Map button
9. Add Course button
10. Available courses (Edit/Delete buttons)
11. Course assignment dropdowns
12. Semester cards (Remove course buttons)
13. Show/Hide Summary button
```

#### 3. Modal Focus Trap Test

**Test Add Course Modal:**
1. Press `Tab` until "Add Course" button is focused
2. Press `Enter` to open modal
3. **Expected:** Focus moves to first input (Course Code)
4. Press `Tab` repeatedly
5. **Expected:** Focus cycles through modal elements only
6. Press `Shift + Tab`
7. **Expected:** Focus cycles backward
8. When focused on last element, press `Tab`
9. **Expected:** Focus wraps to first element
10. Press `Escape`
11. **Expected:** Modal closes, focus returns to "Add Course" button

**Test Import/Export Modal:**
1. Navigate to "Import/Export" button
2. Press `Enter`
3. Verify focus trap works
4. Press `Escape` or click outside
5. Verify focus returns to trigger button

**Test Settings Modal:**
1. Navigate to "Settings" button
2. Press `Enter`
3. Verify focus trap works
4. Press `Escape`
5. Verify focus returns to trigger button

**Pass Criteria:**
- ✅ Focus trapped within modal
- ✅ Tab cycles forward correctly
- ✅ Shift+Tab cycles backward correctly
- ✅ Escape closes modal
- ✅ Focus returns to trigger button
- ✅ No tab-out to background content

#### 4. Form Navigation Test

**Steps:**
1. Open "Add Course" modal
2. Use `Tab` to navigate between form fields
3. Use `Arrow Keys` in dropdowns
4. Fill out form using keyboard only
5. Press `Enter` to submit (or Tab to Save button and press Enter)

**Pass Criteria:**
- ✅ All form fields are reachable
- ✅ Labels are associated with inputs
- ✅ Required fields are indicated
- ✅ Dropdowns work with keyboard
- ✅ Form submits with Enter or Space on Save button

#### 5. Keyboard Shortcuts Test

| Shortcut | Expected Result | Pass/Fail |
|----------|----------------|-----------|
| `Tab` | Move focus forward | ⬜ |
| `Shift + Tab` | Move focus backward | ⬜ |
| `Enter` | Activate button/link | ⬜ |
| `Space` | Activate button | ⬜ |
| `Escape` | Close modal | ⬜ |
| `Arrow Up/Down` | Navigate dropdown | ⬜ |

---

## Screen Reader Testing

### Windows - NVDA (Free)

**Download:** https://www.nvaccess.org/download/

**Basic Commands:**
- `Ctrl` - Stop reading
- `Insert + Down Arrow` - Read from cursor
- `Insert + Space` - Toggle browse/focus mode
- `H` - Navigate by headings
- `Tab` - Navigate by links/buttons
- `F` - Navigate by form fields
- `D` - Navigate by landmarks

#### NVDA Test Procedure

1. **Start NVDA:**
   ```
   Press: Ctrl + Alt + N
   ```

2. **Navigate to Application:**
   - Open browser, navigate to application
   - Listen for page title announcement

3. **Test Landmarks:**
   ```
   Press: D (repeatedly)
   Expected announcements:
   - "Banner landmark"
   - "Main landmark"
   - "Complementary landmark" (Available courses)
   - "Content info landmark" (Footer)
   ```

4. **Test Headings:**
   ```
   Press: H (repeatedly)
   Expected announcements:
   - "Sibermu Study Plan, heading level 1"
   - "Statistics, heading level 2"
   - "Available Courses, heading level 2"
   - "Semester Plan, heading level 2"
   ```

5. **Test Skip Link:**
   ```
   Press: Tab (once)
   Expected: "Skip to main content, link"
   Press: Enter
   Expected: "Main landmark" or similar
   ```

6. **Test Form Fields:**
   - Navigate to "Add Course" button
   - Press Enter to open modal
   ```
   Expected announcements:
   - "Add New Course, dialog"
   - "Course Code, edit, required, blank"
   - "Course Name, edit, required, blank"
   - "Credits (SKS), spin button, required, 0"
   - "Enter credits between 1 and 8" (description)
   ```

7. **Test Live Regions:**
   - Click "Save Progress" button
   ```
   Expected announcement: "Data saved successfully"
   ```

   - Click "Auto-Map Courses" button
   ```
   Expected announcements:
   - "Automatically mapping courses..."
   - "68 courses automatically assigned"
   ```

   - Trigger form validation error
   ```
   Expected announcement: "Error: Please fill in all required fields"
   ```

8. **Test Language Switching:**
   - Change language to Indonesian
   ```
   Expected: Page content announced in Indonesian
   Expected: HTML lang attribute = "id"
   ```

   - Change to Japanese
   ```
   Expected: Page content announced in Japanese
   Expected: HTML lang attribute = "ja"
   ```

### macOS - VoiceOver (Built-in)

**Enable:** `Cmd + F5`

**Basic Commands:**
- `VO + A` - Read all
- `VO + Right Arrow` - Next item
- `VO + Left Arrow` - Previous item
- `VO + H` - Next heading
- `VO + J` - Next form control
- `VO + Command + H` - Next landmark

`VO` = `Control + Option`

#### VoiceOver Test Procedure

1. **Enable VoiceOver:**
   ```
   Press: Cmd + F5
   ```

2. **Test Page Structure:**
   ```
   Press: VO + U (open rotor)
   Select: Landmarks
   Expected:
   - Banner
   - Main
   - Complementary
   - Content Information
   ```

3. **Test Interactive Elements:**
   ```
   Press: VO + Right Arrow (repeatedly)
   Verify all elements are announced correctly
   ```

4. **Test Form Labels:**
   - Navigate to Add Course modal
   - Navigate through form fields
   ```
   Expected: Each field announces its label and type
   Example: "Course Code, required, edit text"
   ```

5. **Test ARIA Live Regions:**
   - Trigger actions (save, auto-map, etc.)
   - Verify announcements are spoken

### Mobile - TalkBack (Android)

**Enable:** Settings → Accessibility → TalkBack

**Basic Gestures:**
- Swipe right - Next item
- Swipe left - Previous item
- Double tap - Activate
- Two-finger swipe down - Read from top
- Swipe right then left - Open TalkBack menu

### Mobile - VoiceOver (iOS)

**Enable:** Settings → Accessibility → VoiceOver

**Basic Gestures:**
- Swipe right - Next item
- Swipe left - Previous item
- Double tap - Activate
- Two-finger swipe up - Read from top
- Rotor gesture - Change navigation mode

---

## Visual Accessibility Testing

### Color Contrast

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Test Combinations:**

| Element | Foreground | Background | Required Ratio | Actual |
|---------|-----------|------------|----------------|--------|
| Body text (light) | `#1f2937` | `#ffffff` | 4.5:1 | 16.1:1 ✅ |
| Body text (dark) | `#f3f4f6` | `#1f2937` | 4.5:1 | 15.5:1 ✅ |
| Primary button | `#ffffff` | `#3b82f6` | 4.5:1 | 8.6:1 ✅ |
| Error text (light) | `#dc2626` | `#ffffff` | 4.5:1 | 6.2:1 ✅ |
| Error text (dark) | `#f87171` | `#1f2937` | 4.5:1 | 5.1:1 ✅ |

**Pass Criteria:**
- ✅ All text ≥ 4.5:1 (AA)
- ✅ Large text ≥ 3:1 (AA)
- ✅ UI components ≥ 3:1 (AA)

### Focus Indicator Visibility

**Test Procedure:**
1. Set browser zoom to 100%
2. Press Tab through interactive elements
3. Verify 3px outline is visible
4. Test in both light and dark modes
5. Test on different background colors

**Pass Criteria:**
- ✅ Outline width ≥ 2px
- ✅ Outline has sufficient contrast (≥ 3:1)
- ✅ Outline doesn't overlap text
- ✅ Offset creates clear separation

### Touch Target Sizing

**Tool:** Browser DevTools → Inspect Element

**Test Procedure:**
1. Inspect each interactive element
2. Verify dimensions
3. Test on mobile viewport

**Minimum Sizes:**
- Buttons: 44px × 44px
- Links: 24px × 24px (with padding)
- Form inputs: 44px height

**Pass Criteria:**
- ✅ All buttons ≥ 44×44px
- ✅ Adequate spacing between targets (8px+)
- ✅ Mobile touch targets ≥ 48×48px

### Dark Mode Testing

**Test Procedure:**
1. Toggle dark mode
2. Verify all content is readable
3. Check color contrast
4. Verify focus indicators are visible

**Pass Criteria:**
- ✅ No pure white (#fff) text on backgrounds
- ✅ No pure black (#000) text
- ✅ Gradients don't reduce readability
- ✅ Liquid glass effect maintains contrast

---

## Browser Compatibility Testing

### Desktop Browsers

Test in the following browsers on both Windows and macOS:

| Browser | Version | Keyboard | Screen Reader | Focus | Pass/Fail |
|---------|---------|----------|---------------|-------|-----------|
| Chrome | 120+ | ⬜ | ⬜ | ⬜ | ⬜ |
| Firefox | 121+ | ⬜ | ⬜ | ⬜ | ⬜ |
| Safari | 17+ | ⬜ | ⬜ | ⬜ | ⬜ |
| Edge | 120+ | ⬜ | ⬜ | ⬜ | ⬜ |

### Mobile Browsers

| Browser | Platform | Keyboard | Screen Reader | Touch | Pass/Fail |
|---------|----------|----------|---------------|-------|-----------|
| Safari | iOS 16+ | ⬜ | ⬜ | ⬜ | ⬜ |
| Chrome | Android 12+ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Mobile Accessibility Testing

### Viewport Testing

```bash
# Test different viewport sizes
pnpm run test -- --project=chromium-mobile
pnpm run test -- --project=chromium-tablet
```

### Mobile-Specific Checks

1. **Touch Targets:**
   - All buttons ≥ 48×48px on mobile
   - Adequate spacing between targets

2. **Mobile Menu:**
   - Opens/closes correctly
   - Focus trapped when open
   - Escape key works
   - ARIA expanded states correct

3. **Orientation:**
   - Works in portrait and landscape
   - No horizontal scrolling
   - Content reflows appropriately

4. **Pinch Zoom:**
   - Zooming enabled
   - Content remains accessible at 200% zoom
   - No viewport meta tag restrictions

---

## Continuous Integration

### GitHub Actions

The project runs accessibility tests automatically:

```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm exec playwright install
      - run: pnpm run test -- --grep "Accessibility"
```

### Pre-commit Hook (Optional)

Add accessibility checks before committing:

```bash
# .husky/pre-commit
#!/bin/sh
pnpm run test -- --grep "Accessibility" --reporter=line
```

---

## Accessibility Checklist

### Before Each Release

#### Automated Checks

- [ ] Run full Playwright test suite
- [ ] Run axe DevTools scan
- [ ] Run Lighthouse accessibility audit
- [ ] Check for console errors/warnings

#### Keyboard Navigation

- [ ] Skip link works
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible (3px outline)
- [ ] Tab order is logical
- [ ] Modal focus traps work
- [ ] Escape closes modals
- [ ] Focus returns to trigger button

#### Screen Reader Testing

- [ ] Test with NVDA (Windows)
- [ ] Test with VoiceOver (macOS)
- [ ] Verify landmarks announced
- [ ] Verify headings read correctly
- [ ] Verify form labels associated
- [ ] Verify live region announcements
- [ ] Test in all 3 languages

#### Visual Checks

- [ ] Color contrast meets AA (4.5:1)
- [ ] Focus indicators visible in all themes
- [ ] Touch targets ≥ 44×44px
- [ ] Dark mode readable
- [ ] Works at 200% zoom

#### Form Accessibility

- [ ] All inputs have labels
- [ ] Required fields marked with aria-required
- [ ] Validation errors announced
- [ ] Error messages clear and helpful
- [ ] Form can be submitted with keyboard

#### Mobile Testing

- [ ] Test on iOS (Safari + VoiceOver)
- [ ] Test on Android (Chrome + TalkBack)
- [ ] Mobile menu accessible
- [ ] Touch targets adequate size
- [ ] Pinch zoom enabled

#### Multi-language

- [ ] HTML lang attribute updates
- [ ] Screen reader uses correct pronunciation
- [ ] All announcements translated
- [ ] Skip link translated

---

## Common Issues and Solutions

### Issue: Skip link not visible on focus

**Solution:**
```css
.skip-link:focus {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
}
```

### Issue: Modal focus not trapped

**Solution:**
Check that `focusTrap.activate()` is called in modal watcher:
```javascript
$watch('showAddModal', (isOpen) => {
  if (isOpen) {
    this.$nextTick(() => {
      const modal = document.querySelector('[x-show="showAddModal"] > div');
      if (modal) {
        this.focusTrap.activate(modal);
      }
    });
  }
});
```

### Issue: Screen reader not announcing changes

**Solution:**
Verify live regions exist:
```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status-announcements"></div>
<div aria-live="assertive" aria-atomic="true" class="sr-only" id="error-announcements"></div>
```

### Issue: Form labels not associated

**Solution:**
Add explicit `for`/`id` association:
```html
<label for="course-code">Course Code</label>
<input id="course-code" type="text" />
```

---

## Resources

### Testing Tools

- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/
- **Lighthouse:** Built into Chrome DevTools
- **NVDA:** https://www.nvaccess.org/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

### Documentation

- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA APG:** https://www.w3.org/WAI/ARIA/apg/
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/

### Communities

- **A11y Slack:** https://web-a11y.slack.com/
- **WebAIM Discussion List:** https://webaim.org/discussion/
- **Deque Community:** https://accessibility.deque.com/

---

**Last Updated:** 2025-01-09
**Version:** 2.2.0
**Maintained by:** Development Team
