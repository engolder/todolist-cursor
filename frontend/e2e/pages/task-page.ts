import { expect, Locator, Page } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly addTaskButton: Locator;
  readonly taskList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.getByPlaceholder('Add a new task...');
    this.addTaskButton = page.getByRole('button', { name: 'Add' });
    this.taskList = page.getByTestId('task-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(taskText: string) {
    await this.taskInput.fill(taskText);
    await this.addTaskButton.click();
  }

  async waitForTaskToAppear(taskText: string) {
    await expect(this.page.getByText(taskText)).toBeVisible();
  }

  async toggleTask(taskText: string) {
    const taskItem = this.page.getByText(taskText).locator('..');
    const checkbox = taskItem.getByRole('checkbox');
    await checkbox.click();
  }

  async deleteTask(taskText: string) {
    const taskItem = this.page.getByText(taskText).locator('..');
    const deleteButton = taskItem.getByRole('button', { name: 'Delete' });
    await deleteButton.click();
  }

  async expectTaskToBeCompleted(taskText: string) {
    const taskItem = this.page.getByText(taskText).locator('..');
    const checkbox = taskItem.getByRole('checkbox');
    await expect(checkbox).toBeChecked();
  }

  async expectTaskToBeActive(taskText: string) {
    const taskItem = this.page.getByText(taskText).locator('..');
    const checkbox = taskItem.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
  }

  async expectTaskNotToExist(taskText: string) {
    await expect(this.page.getByText(taskText)).not.toBeVisible();
  }

  async getTaskCount(): Promise<number> {
    const tasks = this.page.locator('[data-testid="task-item"]');
    return await tasks.count();
  }
}