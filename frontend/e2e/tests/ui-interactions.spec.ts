import { test, expect } from '../fixtures/test-fixtures';

test.describe('UI Interactions', () => {
  test.beforeEach(async ({ taskPage }) => {
    await taskPage.goto();
  });

  test('should handle keyboard interactions', async ({ taskPage }) => {
    const taskText = `Keyboard task ${Date.now()}`;

    // Add task using Enter key
    await taskPage.taskInput.fill(taskText);
    await taskPage.taskInput.press('Enter');

    await taskPage.waitForTaskToAppear(taskText);
    await expect(taskPage.page.getByText(taskText)).toBeVisible();
  });

  test('should show proper focus states', async ({ taskPage, page }) => {
    // Focus on task input
    await taskPage.taskInput.focus();
    await expect(taskPage.taskInput).toBeFocused();

    // Tab to add button
    await page.keyboard.press('Tab');
    await expect(taskPage.addTaskButton).toBeFocused();
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile layout works
    await expect(page.getByRole('main')).toBeVisible();

    const taskInput = page.getByPlaceholder('Add a new task...');
    await expect(taskInput).toBeVisible();

    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeVisible();
  });

  test('should handle rapid task creation', async ({ taskPage }) => {
    const tasks = Array.from({ length: 5 }, (_, i) => `Rapid task ${i + 1} ${Date.now()}`);

    // Rapidly create tasks
    for (const task of tasks) {
      await taskPage.taskInput.fill(task);
      await taskPage.taskInput.press('Enter');
      // Small delay to avoid overwhelming the system
      await taskPage.page.waitForTimeout(100);
    }

    // Wait for all tasks to appear
    for (const task of tasks) {
      await taskPage.waitForTaskToAppear(task);
    }

    // Verify all tasks are visible
    for (const task of tasks) {
      await expect(taskPage.page.getByText(task)).toBeVisible();
    }
  });

  test('should maintain scroll position with many tasks', async ({ taskPage, page }) => {
    // Create many tasks to enable scrolling
    const tasks = Array.from({ length: 20 }, (_, i) => `Scroll task ${i + 1} ${Date.now()}`);

    for (const task of tasks) {
      await taskPage.addTask(task);
      await taskPage.page.waitForTimeout(50); // Small delay for UI updates
    }

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Add another task
    const lastTask = `Last task ${Date.now()}`;
    await taskPage.addTask(lastTask);
    await taskPage.waitForTaskToAppear(lastTask);

    // Verify we can still see the new task
    await expect(page.getByText(lastTask)).toBeVisible();
  });

  test('should handle task text with special characters', async ({ taskPage }) => {
    const specialChars = [
      'Task with "quotes"',
      'Task with <brackets>',
      'Task with & ampersand',
      'Task with émojis 🎯',
      'Task with ñ special chars'
    ];

    for (const task of specialChars) {
      await taskPage.addTask(task);
      await taskPage.waitForTaskToAppear(task);
      await expect(taskPage.page.getByText(task)).toBeVisible();
    }
  });
});