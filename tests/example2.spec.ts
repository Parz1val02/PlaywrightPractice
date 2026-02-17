import { test } from "../fixtures/dev-playwright";

test.describe("Playwright website", () => {
  const URL: string = "https://playwright.dev/";
  const pageTitle: RegExp = /Playwright/;
  const pageUrl: RegExp = /intro$/;

  test.beforeEach(async ({ homePage }) => {
    await homePage.goToPage(URL);
  });

  test("has title", async ({ homePage }) => {
    await homePage.assertPageTitle(pageTitle);
  });

  test("get started link", async ({ homePage, topMenuPage }) => {
    await homePage.clickGetStarted();
    await topMenuPage.assertPageUrl(pageUrl);
  });

  test("check Java page", async ({ homePage, topMenuPage }) => {
    await test.step("Act", async () => {
      await homePage.clickGetStarted();
      await topMenuPage.hoverNode();
      await topMenuPage.clickJava();
    });

    await test.step("Assert", async () => {
      await topMenuPage.assertPageUrl(pageUrl);
      await topMenuPage.assertNodeDescriptionNotVisible();
      await topMenuPage.assertJavaDescriptionVisible();
    });
  });

  test("check Python page", async ({ homePage, topMenuPage }) => {
    await test.step("Act", async () => {
      await homePage.clickGetStarted();
      await topMenuPage.hoverNode();
      await topMenuPage.clickPython();
    });

    await test.step("Assert", async () => {
      await topMenuPage.assertPageUrl(pageUrl);
      await topMenuPage.assertNodeDescriptionNotVisible();
      await topMenuPage.assertPythonDescriptionVisible();
    });
  });

  test("check .NET page", async ({ homePage, topMenuPage }) => {
    await test.step("Act", async () => {
      await homePage.clickGetStarted();
      await topMenuPage.hoverNode();
      await topMenuPage.ClickDotNet();
    });

    await test.step("Assert", async () => {
      await topMenuPage.assertPageUrl(pageUrl);
      await topMenuPage.assertNodeDescriptionNotVisible();
      await topMenuPage.assertDotNetDescriptionVisible();
    });
  });

  test("Check github link", async ({ homePage, topMenuPage }) => {
    await homePage.clickGetStarted();
    await topMenuPage.externalLinkGithub();
  });

  test("Check discord link", async ({ homePage, topMenuPage }) => {
    await homePage.clickGetStarted();
    await topMenuPage.externalLinkDiscord();
  });

  test("Test search modal", async ({ homePage, topMenuPage }) => {
    await homePage.clickGetStarted();
    await topMenuPage.changeAppearance();
    await topMenuPage.testSearchModal();
  });
});
