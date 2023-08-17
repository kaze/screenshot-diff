import path from "node:path";

import { test, expect } from "@playwright/test";

import config from "../src/config.js";
import compare_images from "../src/compare.js";

test.describe("image comparison", async () => {
  test("comparing two pictures", async ({ page }) => {
    const local = path.resolve(
      path.join(
        config.REMOTE_SCREENSHOT_DIR,
        "about-us-canada--1692261935984.png",
      ),
    );
    const remote = path.resolve(
      path.join(
        config.REMOTE_SCREENSHOT_DIR,
        "about-us-canada--1692261935984.png",
      ),
    );
    const result = compare_images(remote, local);

    expect(result).toBe(0);
  });
});
