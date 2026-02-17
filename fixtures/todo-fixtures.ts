import { test as base } from "@playwright/test";
import { TodoPage } from "../pages/todo-page";

export const test = base.extend<{
  todoPage: TodoPage;
}>({
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
});

export { expect, Page } from "@playwright/test";
