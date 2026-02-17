import { Page, Locator, expect } from "@playwright/test";

export class TodoPage {
  readonly page: Page;
  readonly newTodo: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly toggleAll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodo = page.getByPlaceholder("What needs to be done?");
    this.todoItems = page.getByTestId("todo-item");
    this.todoTitles = page.getByTestId("todo-title");
    this.toggleAll = page.getByLabel("Mark all as complete");
  }

  async goto() {
    await this.page.goto("https://demo.playwright.dev/todomvc");
  }

  async addTodo(text: string) {
    await this.newTodo.fill(text);
    await this.newTodo.press("Enter");
  }

  async getTodo(index: number) {
    return this.todoItems.nth(index);
  }

  async addDefaultTodos(items: string[]) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  async expectTodosInLocalStorage(expected: number) {
    await expect
      .poll(() =>
        this.page.evaluate(() => {
          const todos = localStorage.getItem("react-todos");
          return todos ? JSON.parse(todos).length : 0;
        }),
      )
      .toBe(expected);
  }

  async expectCompletedTodosInLocalStorage(expected: number) {
    await expect
      .poll(() =>
        this.page.evaluate(() => {
          const raw = localStorage.getItem("react-todos");
          if (!raw) return 0;
          const todos = JSON.parse(raw);
          return todos.filter((todo: any) => todo.completed).length;
        }),
      )
      .toBe(expected);
  }

  async checkTodosInLocalStorage(title: string) {
    await expect
      .poll(() =>
        this.page.evaluate(() => {
          const raw = localStorage.getItem("react-todos");
          if (!raw) return [];
          const todos = JSON.parse(raw);
          return todos.map((todo: any) => todo.title);
        }),
      )
      .toContain(title);
  }
}
