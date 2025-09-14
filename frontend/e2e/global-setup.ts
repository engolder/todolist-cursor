import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Check if we're running in CI or if services should be auto-started
  const shouldStartServices = process.env.CI || process.env.AUTO_START_SERVICES;

  if (shouldStartServices) {
    console.log('⚠️  Global setup: Services should be started externally in CI');
    return;
  }

  // For local development, we assume services are already running
  console.log('🚀 Global setup: Checking if local services are available...');

  // Test backend connection
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const response = await page.request.get('http://localhost:8080/health');
    if (!response.ok()) {
      throw new Error(`Backend health check failed: ${response.status()}`);
    }

    console.log('✅ Backend is running on http://localhost:8080');
    await browser.close();
  } catch (error) {
    console.error('❌ Backend is not available. Please run `make dev` first.');
    console.error('Error:', error);
    process.exit(1);
  }

  // Test frontend connection
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const response = await page.request.get('http://localhost:5173');
    if (!response.ok()) {
      throw new Error(`Frontend is not available: ${response.status()}`);
    }

    console.log('✅ Frontend is running on http://localhost:5173');
    await browser.close();
  } catch (error) {
    console.error('❌ Frontend is not available. Please run `make dev` first.');
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('🎉 All services are ready for E2E testing!');
}

export default globalSetup;