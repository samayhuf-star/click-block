# AdGuardian Playwright Tests

Comprehensive testing suite for the AdGuardian SaaS platform.

## Test Files

### 1. `landing-page.spec.ts`
Tests for the main landing page including:
- Hero section
- Navigation
- Statistics display
- Features section
- CTA sections
- Footer
- Responsive design (mobile, tablet, desktop)

### 2. `navigation.spec.ts`
Tests for navigation functionality:
- Navbar visibility and stickiness
- Button interactions
- Scroll behavior
- Styling verification

### 3. `accessibility.spec.ts`
Accessibility compliance tests:
- WCAG 2.0 AA compliance
- Keyboard navigation
- Color contrast
- Alt text for images
- Proper heading hierarchy

### 4. `performance.spec.ts`
Performance and reliability tests:
- Page load time
- Console errors
- Network request failures
- Resource loading (images, CSS, JS)

### 5. `visual.spec.ts`
Visual regression tests:
- Full page screenshots
- Component screenshots
- Multi-device screenshots

## Installation

```bash
# Install Playwright
npm init playwright@latest

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install accessibility testing
npm install --save-dev @axe-core/playwright
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests 5 times (stability check)
```bash
npm run test:5x
```

Or use the shell scripts:

**Linux/Mac:**
```bash
chmod +x run-tests-5x.sh
./run-tests-5x.sh
```

**Windows:**
```cmd
run-tests-5x.bat
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/landing-page.spec.ts
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests on mobile devices
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Results

Test results are saved in:
- `test-results/` - Test artifacts (videos, screenshots)
- `playwright-report/` - HTML report
- `test-results/results.json` - JSON report
- `test-results/junit.xml` - JUnit XML report

## CI/CD Integration

The tests are configured to work in CI environments:
- Automatic retries on failure
- Parallel execution
- Multiple output formats (HTML, JSON, JUnit)

## Browser Coverage

Tests run on:
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Chrome Mobile (Pixel 5)
- ✅ Safari Mobile (iPhone 12)
- ✅ Microsoft Edge
- ✅ Google Chrome

## Best Practices

1. **Run tests locally** before committing
2. **Review screenshots** for visual regressions
3. **Check accessibility** results regularly
4. **Monitor performance** metrics
5. **Run 5x tests** to catch flaky tests

## Troubleshooting

### Tests failing locally?
1. Make sure dev server is running: `npm run dev`
2. Clear test cache: `npx playwright test --clear-cache`
3. Update browsers: `npx playwright install`

### Visual tests failing?
1. Update baseline screenshots: `npx playwright test --update-snapshots`
2. Review differences in test report

### Accessibility tests failing?
1. Review violations in the HTML report
2. Fix WCAG issues in components
3. Re-run tests to verify
