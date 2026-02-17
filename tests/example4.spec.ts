import { test, expect, Page } from "../fixtures/todo-fixtures";

const TODO_ITEMS = ["Practice parkour", "Go bati", "Work on thesis"];

test.beforeEach(async ({ todoPage, page }) => {
  await todoPage.goto();
  await page.evaluate(() => localStorage.clear());
});

test.describe("New Todo", () => {
  test("should allow me to add todo items ", async ({ todoPage }) => {
    await todoPage.addTodo(TODO_ITEMS[0]);
    await todoPage.addTodo(TODO_ITEMS[1]);
    await expect(todoPage.todoTitles).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);

    await todoPage.expectTodosInLocalStorage(2);
  });

  test("should clear text input field when an item is added", async ({
    todoPage,
  }) => {
    await todoPage.addTodo(TODO_ITEMS[0]);
    await expect(todoPage.newTodo).toBeEmpty();
    await todoPage.expectTodosInLocalStorage(1);
  });

  test("should append new items to the bottom of the list", async ({
    todoPage,
  }) => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await expect(todoPage.todoCount).toHaveText("3 items left");
    await expect(todoPage.todoTitles).toHaveText(TODO_ITEMS);
    await todoPage.expectTodosInLocalStorage(3);
  });
});

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await todoPage.expectTodosInLocalStorage(3);
  });

  test.afterEach(async ({ todoPage }) => {
    await todoPage.expectTodosInLocalStorage(3);
  });

  test("should allow me to mark all items as completed", async ({
    todoPage,
  }) => {
    await todoPage.toggleAll.check();
    await expect(todoPage.todoItems).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
  });

  test("should allow me to clear the complete state of all items", async ({
    todoPage,
  }) => {
    await todoPage.toggleAll.check();
    await todoPage.toggleAll.uncheck();
    await expect(todoPage.todoItems).toHaveClass(["", "", ""]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    todoPage,
  }) => {
    await todoPage.toggleAll.check();
    await expect(todoPage.toggleAll).toBeChecked();
    await todoPage.expectCompletedTodosInLocalStorage(3);

    const firstTodo = todoPage.todoItems.first();
    await firstTodo.getByRole("checkbox").uncheck();

    await expect(todoPage.toggleAll).not.toBeChecked();
    await todoPage.expectCompletedTodosInLocalStorage(2);

    await firstTodo.getByRole("checkbox").check();
    await todoPage.expectCompletedTodosInLocalStorage(3);
    await expect(todoPage.toggleAll).toBeChecked();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ todoPage }) => {
    todoPage.addDefaultTodos(TODO_ITEMS.slice(0, 2));

    const firstTodo = todoPage.todoItems.nth(0);
    await firstTodo.getByRole("checkbox").check();
    await expect(firstTodo).toHaveClass("completed");

    const secondTodo = todoPage.todoItems.nth(1);
    await expect(secondTodo).not.toHaveClass("completed");
    await secondTodo.getByRole("checkbox").check();

    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).toHaveClass("completed");
  });

  test("should allow me to un-mark items as complete", async ({ todoPage }) => {
    todoPage.addDefaultTodos(TODO_ITEMS.slice(0, 2));

    const firstTodo = todoPage.todoItems.nth(0);
    const secondTodo = todoPage.todoItems.nth(1);

    const firstTodoCheckbox = firstTodo.getByRole("checkbox");
    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await todoPage.expectCompletedTodosInLocalStorage(1);

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await todoPage.expectCompletedTodosInLocalStorage(0);
  });

  test("should allow me to edit an item", async ({ todoPage }) => {
    await todoPage.addDefaultTodos(TODO_ITEMS);

    const secondTodo = todoPage.todoItems.nth(1);
    await secondTodo.dblclick();
    await expect(secondTodo.getByRole("textbox", { name: "Edit" })).toHaveValue(
      TODO_ITEMS[1],
    );
    await secondTodo
      .getByRole("textbox", { name: "Edit" })
      .fill("buy some sausages");
    await secondTodo.getByRole("textbox", { name: "Edit" }).press("Enter");

    await expect(todoPage.todoItems).toHaveText([
      TODO_ITEMS[0],
      "buy some sausages",
      TODO_ITEMS[2],
    ]);
    await todoPage.checkTodosInLocalStorage("buy some sausages");
  });
});

test.describe("Editing", () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addDefaultTodos(TODO_ITEMS);
    await todoPage.expectTodosInLocalStorage(3);
  });

  test("should hide other controls when editing", async ({ todoPage }) => {
    const todoItem = todoPage.todoItems.nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible();
    await expect(
      todoItem.locator("label", {
        hasText: TODO_ITEMS[1],
      }),
    ).not.toBeVisible();
  });

  test("should save edits on blur", async ({ todoPage }) => {
    const firstItem = todoPage.todoItems.nth(1);
    await firstItem.dblclick();
    const textbox = firstItem.getByRole("textbox", { name: "Edit" });
    await textbox.fill("buy some sausages");
    await firstItem.getByRole("textbox", { name: "Edit" }).blur();

    await expect(todoPage.todoItems).toHaveText([
      TODO_ITEMS[0],
      "buy some sausages",
      TODO_ITEMS[2],
    ]);
    await todoPage.checkTodosInLocalStorage("buy some sausages");
  });

  test("should trim entered text", async ({ todoPage }) => {
    const firstItem = todoPage.todoItems.nth(1);
    await firstItem.dblclick();
    const textbox = firstItem.getByRole("textbox", { name: "Edit" });
    await textbox.fill("    buy some sausages    ");
    await firstItem.getByRole("textbox", { name: "Edit" }).press("Enter");

    await expect(todoPage.todoItems).toHaveText([
      TODO_ITEMS[0],
      "buy some sausages",
      TODO_ITEMS[2],
    ]);
    await todoPage.checkTodosInLocalStorage("buy some sausages");
  });

  test("should remove the item if an empty text string was entered", async ({
    todoPage,
  }) => {
    const firstItem = todoPage.todoItems.nth(1);
    await firstItem.dblclick();
    const textbox = firstItem.getByRole("textbox", { name: "Edit" });
    await textbox.fill("");
    await textbox.press("Enter");

    await expect(todoPage.todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should cancel edits on escape", async ({ todoPage }) => {
    const firstItem = todoPage.todoItems.nth(1);
    await firstItem.dblclick();
    const textbox = firstItem.getByRole("textbox", { name: "Edit" });
    await textbox.fill("buy some sausages");
    await textbox.press("Escape");
    await expect(todoPage.todoItems).toHaveText(TODO_ITEMS);
  });
});

test.describe("Counter", () => {
  test("should display the current number of todo items", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // create a todo count locator
    const todoCount = page.getByTestId("todo-count");

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    await expect(todoCount).toContainText("1");

    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");
    await expect(todoCount).toContainText("2");

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe("Clear completed button", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test("should display the correct text", async ({ page }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await expect(
      page.getByRole("button", { name: "Clear completed" }),
    ).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should be hidden when there are no items that are completed", async ({
    page,
  }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(
      page.getByRole("button", { name: "Clear completed" }),
    ).toBeHidden();
  });
});

test.describe("Persistence", () => {
  test("should persist its data", async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }

    const todoItems = page.getByTestId("todo-item");
    const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
    await firstTodoCheck.check();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);

    // Ensure there is 1 completed item.
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Now reload.
    await page.reload();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);
  });
});

test.describe("Routing", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test("should allow me to display active items", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Active" }).click();
    await expect(todoItem).toHaveCount(2);
    await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should respect the back button", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);

    await test.step("Showing all items", async () => {
      await page.getByRole("link", { name: "All" }).click();
      await expect(todoItem).toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await page.getByRole("link", { name: "Active" }).click();
    });

    await test.step("Showing completed items", async () => {
      await page.getByRole("link", { name: "Completed" }).click();
    });

    await expect(todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoItem).toHaveCount(3);
  });

  test("should allow me to display completed items", async ({ page }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Completed" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(1);
  });

  test("should allow me to display all items", async ({ page }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole("link", { name: "Active" }).click();
    await page.getByRole("link", { name: "Completed" }).click();
    await page.getByRole("link", { name: "All" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    await expect(page.getByRole("link", { name: "All" })).toHaveClass(
      "selected",
    );

    //create locators for active and completed links
    const activeLink = page.getByRole("link", { name: "Active" });
    const completedLink = page.getByRole("link", { name: "Completed" });
    await activeLink.click();

    // Page change - active items.
    await expect(activeLink).toHaveClass("selected");
    await completedLink.click();

    // Page change - completed items.
    await expect(completedLink).toHaveClass("selected");
  });
});

async function createDefaultTodos(page: Page) {
  const newTodo = page.getByPlaceholder("What needs to be done?");

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press("Enter");
  }
}

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}

async function checkNumberOfCompletedTodosInLocalStorage(
  page: Page,
  expected: number,
) {
  return await page.waitForFunction((e) => {
    return (
      JSON.parse(localStorage["react-todos"]).filter(
        (todo: any) => todo.completed,
      ).length === e
    );
  }, expected);
}

async function checkTodosInLocalStorage(page: Page, title: string) {
  return await page.waitForFunction((t) => {
    return JSON.parse(localStorage["react-todos"])
      .map((todo: any) => todo.title)
      .includes(t);
  }, title);
}
