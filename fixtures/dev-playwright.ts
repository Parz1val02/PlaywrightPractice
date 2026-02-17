import { test as base } from "@playwright/test";
import { TopMenuPage } from "../pages/top-menu-page";
import { HomePage } from "../pages/home-page";

type PlaywrightFixtures = {
  topMenuPage: TopMenuPage;
  homePage: HomePage;
};

export const test = base.extend<PlaywrightFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  topMenuPage: async ({ page }, use) => {
    await use(new TopMenuPage(page));
  },
});
