import { type Locator, type Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.getByRole("link", { name: "Get started" });
  }

  async goToPage(URL: string) {
    await this.page.goto(URL);
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async assertPageTitle(title: RegExp) {
    await expect(this.page).toHaveTitle(title);
  }
}
