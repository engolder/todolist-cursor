import { test as base, Page } from '@playwright/test';
import { TaskPage } from '../pages/task-page';

export interface TestFixtures {
  taskPage: TaskPage;
}

export const test = base.extend<TestFixtures>({
  taskPage: async ({ page }, use) => {
    const taskPage = new TaskPage(page);
    await use(taskPage);
  },
});

export { expect } from '@playwright/test';