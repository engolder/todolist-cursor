import { test, expect } from '../fixtures/test-fixtures';

test.describe('Task CRUD Operations', () => {
  test.beforeEach(async ({ taskPage }) => {
    await taskPage.goto();
  });

  test('should create a new task', async ({ taskPage }) => {
    const taskText = `New task ${Date.now()}`;

    await taskPage.addTask(taskText);
    await taskPage.waitForTaskToAppear(taskText);

    // Verify task appears in the list
    await expect(taskPage.page.getByText(taskText)).toBeVisible();
  });

  test('should toggle task completion status', async ({ taskPage }) => {
    const taskText = `Toggle task ${Date.now()}`;

    // Create a task
    await taskPage.addTask(taskText);
    await taskPage.waitForTaskToAppear(taskText);

    // Initially task should be active (not completed)
    await taskPage.expectTaskToBeActive(taskText);

    // Toggle to completed
    await taskPage.toggleTask(taskText);
    await taskPage.expectTaskToBeCompleted(taskText);

    // Toggle back to active
    await taskPage.toggleTask(taskText);
    await taskPage.expectTaskToBeActive(taskText);
  });

  test('should delete a task', async ({ taskPage }) => {
    const taskText = `Delete task ${Date.now()}`;

    // Create a task
    await taskPage.addTask(taskText);
    await taskPage.waitForTaskToAppear(taskText);

    // Delete the task
    await taskPage.deleteTask(taskText);
    await taskPage.expectTaskNotToExist(taskText);
  });

  test('should handle multiple tasks', async ({ taskPage }) => {
    const tasks = [
      `Task 1 ${Date.now()}`,
      `Task 2 ${Date.now()}`,
      `Task 3 ${Date.now()}`
    ];

    // Create multiple tasks
    for (const task of tasks) {
      await taskPage.addTask(task);
      await taskPage.waitForTaskToAppear(task);
    }

    // Verify all tasks are visible
    for (const task of tasks) {
      await expect(taskPage.page.getByText(task)).toBeVisible();
    }

    // Complete first task
    await taskPage.toggleTask(tasks[0]);
    await taskPage.expectTaskToBeCompleted(tasks[0]);

    // Other tasks should remain active
    await taskPage.expectTaskToBeActive(tasks[1]);
    await taskPage.expectTaskToBeActive(tasks[2]);
  });

  test('should handle empty task input validation', async ({ taskPage }) => {
    const initialCount = await taskPage.getTaskCount();

    // Try to add empty task
    await taskPage.addTaskButton.click();

    // Task count should remain the same
    const finalCount = await taskPage.getTaskCount();
    expect(finalCount).toBe(initialCount);
  });

  test('should persist tasks after page reload', async ({ taskPage }) => {
    const taskText = `Persistent task ${Date.now()}`;

    // Create a task
    await taskPage.addTask(taskText);
    await taskPage.waitForTaskToAppear(taskText);

    // Reload the page
    await taskPage.page.reload();

    // Task should still be visible
    await taskPage.waitForTaskToAppear(taskText);
    await expect(taskPage.page.getByText(taskText)).toBeVisible();
  });
});