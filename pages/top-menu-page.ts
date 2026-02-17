import { expect, Locator, Page } from "@playwright/test";

export class TopMenuPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;
  readonly nodeLink: Locator;
  readonly javaLink: Locator;
  readonly pythonLink: Locator;
  readonly dotnetLink: Locator;
  readonly nodeLabel: Locator;
  readonly javaLabel: Locator;
  readonly pythonLabel: Locator;
  readonly dotnetLabel: Locator;
  readonly nodeDescription: string = "Installing Playwright";
  readonly javaDescription: string = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`;
  readonly pythonDescription: string = `The Playwright library can be used as a general purpose browser automation tool, providing a powerful set of APIs to automate web applications, for both sync and async Python.`;
  readonly dotnetDescription: string = `You can choose to use MSTest, NUnit, or xUnit base classes that Playwright provides to write end-to-end tests. These classes support running tests on multiple browser engines, parallelizing tests, adjusting launch/context options and getting a Page/BrowserContext instance per test out of the box. Alternatively you can use the library to manually write the testing infrastructure.`;
  readonly githubLogo: Locator;
  readonly discordLogo: Locator;
  readonly searchbar: Locator;
  readonly appearance: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole("link", { name: "Get started" });
    this.docsLink = page.getByRole("link", { name: "Docs" });
    this.apiLink = page.getByRole("link", { name: "API" });
    this.communityLink = page.getByRole("link", { name: "Community" });
    this.nodeLink = page.getByRole("button", { name: "Node.js" });
    this.javaLink = page
      .getByRole("navigation", { name: "Main" })
      .getByText("Java");
    this.pythonLink = page
      .getByLabel("Main", { exact: true })
      .getByRole("link", { name: "Python" });
    this.dotnetLink = page
      .getByLabel("Main", { exact: true })
      .getByRole("link", { name: ".NET" });
    this.nodeLabel = page.getByText(this.nodeDescription, { exact: true });
    this.javaLabel = page.getByText(this.javaDescription);
    this.pythonLabel = page.getByText(this.pythonDescription);
    this.dotnetLabel = page.getByText(this.dotnetDescription);
    this.githubLogo = page.getByRole("link", { name: "GitHub repository" });
    this.discordLogo = page.getByRole("link", { name: "Discord server" });
    this.searchbar = page.getByRole("button", { name: "Search (Ctrl+K)" });
    this.appearance = page.getByRole("button", {
      name: "Switch between dark and light",
    });
  }

  async hoverNode() {
    await this.nodeLink.hover();
  }

  async clickJava() {
    await this.javaLink.click();
  }

  async clickPython() {
    await this.pythonLink.click();
  }

  async ClickDotNet() {
    await this.dotnetLink.click();
  }

  async assertPageUrl(pageUrl: RegExp) {
    await expect(this.page).toHaveURL(pageUrl);
  }

  async assertNodeDescriptionNotVisible() {
    await expect(this.nodeLabel).not.toBeVisible();
  }

  async assertJavaDescriptionVisible() {
    await expect(this.javaLabel).toBeVisible();
  }

  async assertPythonDescriptionVisible() {
    await expect(this.pythonLabel).toBeVisible();
  }

  async assertDotNetDescriptionVisible() {
    await expect(this.dotnetLabel).toBeVisible();
  }

  async externalLinkGithub() {
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.githubLogo.click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/github/);
  }

  async externalLinkDiscord() {
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.discordLogo.click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/discord/);
  }

  async testSearchModal() {
    await this.page.getByRole("button", { name: "Search (Ctrl+K)" }).click();
    await expect(
      this.page.getByRole("searchbox", { name: "Search" }),
    ).toBeVisible();
    await this.page
      .getByRole("searchbox", { name: "Search" })
      .fill("languages");
    await this.page
      .getByRole("option", { name: "Supported languages", exact: true })
      .getByRole("link")
      .click();
    await expect(this.page).toHaveURL(/languages/);
  }

  async changeAppearance() {
    await this.appearance.click();
    await this.appearance.click();
    await this.appearance.click();
  }
}
