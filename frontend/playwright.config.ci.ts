import { defineConfig, devices } from '@playwright/test';
import baseConfig from './playwright.config';

/**
 * CI-specific Playwright configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  ...baseConfig,

  // CI-specific settings
  fullyParallel: false, // Run tests serially in CI for stability
  workers: 1, // Single worker in CI
  retries: 2, // More retries in CI

  // Reporter for CI
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
    ['github'], // GitHub Actions annotations
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],

  // CI-specific test settings
  use: {
    ...baseConfig.use,
    // More conservative timeouts in CI
    actionTimeout: 10000,
    navigationTimeout: 30000,
    // Always capture on CI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Projects - focus on core browsers for CI
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Skip webkit and mobile in CI to save time
  ],

  // Don't start web server in CI (services started externally)
  webServer: undefined,
});