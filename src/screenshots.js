import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

import compare_images from "./compare.js";
import config from "./config.js";

const url_to_filename = (url, remote) => {
  const to_replace = remote ? config.REMOTE_BASE_URL : config.LOCAL_BASE_URL;
  const directory = remote
    ? config.REMOTE_SCREENSHOT_DIR
    : config.LOCAL_SCREENSHOT_DIR;
  url = url.replace(to_replace, "");
  let name = url.replaceAll("/", "-").replace(/^-/, "").replace(/-$/, "");

  // screenshot of the root page is a special case, because we emptied
  // its name in the previous step
  if (name === "") {
    name = "root";
  }

  return path.join(directory, `${name}--${Date.now()}.png`);
};

const take_screenshot = async (page, url, remote) => {
  // we only have a set of remote urls from the remote sitemap, so here
  // we are creating local urls by changing the protocol and host in
  // the url -- needed the capture the given page
  if (!remote) {
    url.replace(config.REMOTE_BASE_URL, config.LOCAL_BASE_URL);
  }

  const file_path = url_to_filename(url, remote);

  await page.goto(url);

  return await page.screenshot({
    path: file_path,
    fullPage: true,
  });
};

const with_browser_page = async (fn) => {
  let browser = await chromium.launch();
  let page = await browser.newPage({ extraHTTPHeaders: config.HEADERS });
  await page.setViewportSize({ width: 1280, height: 1080 });

  await fn(page);

  await browser.close();
};

export const take_screenshots = async (urls, remote) => {
  return await with_browser_page(async (page) => {
    for (const url of urls) {
      await take_screenshot(page, url, remote);
    }
  });
};

const normalize_name = (name) => {
  return name.split("--")[0];
};

export const compare_screenshots = async () => {
  const local_screenshots = fs.readdirSync(config.LOCAL_SCREENSHOT_DIR);
  const remote_screenshots = fs.readdirSync(config.REMOTE_SCREENSHOT_DIR);

  for (const local of local_screenshots) {
    const remote = remote_screenshots.find((screenshot) => {
      return normalize_name(screenshot) === normalize_name(local);
    });

    const result = compare_images(
      path.join(config.REMOTE_SCREENSHOT_DIR, remote),
      path.join(config.LOCAL_SCREENSHOT_DIR, local),
    );
  }
};
