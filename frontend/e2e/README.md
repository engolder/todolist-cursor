# E2E Testing with Playwright

This directory contains end-to-end tests for the Todo List application using Playwright.

## Overview

The E2E tests verify the complete functionality of the application by testing the interaction between the React frontend and Go backend services.

## Test Structure

```
e2e/
├── README.md              # This file
├── global-setup.ts        # Global setup for all tests
├── fixtures/              # Reusable test fixtures
│   └── test-fixtures.ts   # Custom test fixtures
├── pages/                 # Page Object Models
│   └── task-page.ts       # Task page interactions
└── tests/                 # Test specifications
    ├── health-check.spec.ts    # Basic application health
    ├── task-crud.spec.ts       # Task CRUD operations
    └── ui-interactions.spec.ts # UI behavior tests
```

## Running Tests

### Prerequisites

1. **Backend Services**: The Go backend must be running on `http://localhost:8080`
2. **Frontend**: The React app must be running on `http://localhost:5173`

Start both services:
```bash
# From project root
make dev
```

### Local Development

```bash
# Run all E2E tests
make test-e2e
# or
cd frontend && yarn test:e2e

# Run with UI mode for debugging
yarn test:e2e:ui

# Run in headed mode (see browser)
yarn test:e2e:headed

# Debug specific test
yarn test:e2e:debug

# Run specific browser
yarn test:e2e:chromium
yarn test:e2e:firefox
yarn test:e2e:webkit

# View test report
yarn test:e2e:report
```

### CI Environment

```bash
# Run with CI configuration
make test-e2e-ci
# or
yarn test:e2e:ci
```

## Test Configurations

### Local Development (`playwright.config.ts`)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge
- **Parallelization**: Full parallel execution
- **Retries**: No retries (fail fast for debugging)
- **Web Server**: Auto-starts Vite dev server
- **Reports**: HTML, JUnit, List (console)
- **Artifacts**: Screenshots and videos on failure

### CI Environment (`playwright.config.ci.ts`)
- **Browsers**: Chromium, Firefox (core browsers only)
- **Parallelization**: Single worker for stability
- **Retries**: 2 retries for flaky test handling
- **Web Server**: External (started by CI workflow)
- **Reports**: HTML, JUnit, GitHub Actions, JSON
- **Artifacts**: Full trace and video retention on failure

## Writing Tests

### Page Object Pattern

Use the page object pattern for maintainable tests:

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('should create a task', async ({ taskPage }) => {
  await taskPage.goto();
  await taskPage.addTask('New task');
  await taskPage.waitForTaskToAppear('New task');
});
```

### Test Organization

- **Health Check Tests**: Basic application functionality
- **CRUD Tests**: Create, Read, Update, Delete operations
- **UI Tests**: User interface interactions and edge cases

### Best Practices

1. **Use data-testid**: Add `data-testid` attributes to components for reliable selection
2. **Wait for elements**: Use `waitFor` methods instead of fixed timeouts
3. **Isolate tests**: Each test should be independent and clean up after itself
4. **Descriptive names**: Use clear, descriptive test names
5. **Page objects**: Encapsulate page interactions in page object classes

## Debugging

### Local Debugging

```bash
# Run single test in debug mode
yarn test:e2e:debug --grep "should create a task"

# Run with headed browser
yarn test:e2e:headed

# Generate trace
yarn test:e2e --trace on
```

### CI Debugging

When tests fail in CI:

1. **Download artifacts** from GitHub Actions
2. **View HTML report**: Open `playwright-report/index.html`
3. **Check traces**: Use Playwright trace viewer
4. **Screenshots/Videos**: Review failure artifacts

### Common Issues

1. **Services not running**: Ensure `make dev` is running before tests
2. **Port conflicts**: Check that ports 5173 (frontend) and 8080 (backend) are available
3. **Timing issues**: Use proper wait conditions instead of fixed delays
4. **Browser dependencies**: Run `npx playwright install` if browsers are missing

## Adding New Tests

1. Create test file in `e2e/tests/`
2. Import fixtures: `import { test, expect } from '../fixtures/test-fixtures'`
3. Use page objects for interactions
4. Follow naming convention: `feature-name.spec.ts`
5. Add appropriate test-ids to components if needed

Example:
```typescript
import { test, expect } from '../fixtures/test-fixtures';

test.describe('New Feature', () => {
  test.beforeEach(async ({ taskPage }) => {
    await taskPage.goto();
  });

  test('should do something', async ({ taskPage }) => {
    // Test implementation
  });
});
```

## Integration with CI/CD

The E2E tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

CI workflow:
1. Install dependencies (Node.js, Go, Playwright browsers)
2. Build frontend application
3. Start backend services
4. Wait for services to be ready
5. Run E2E tests with CI configuration
6. Upload test artifacts (reports, screenshots, videos)
7. Clean up services