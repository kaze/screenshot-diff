import fs from "fs";
import path from "path";

import { chromium } from "playwright";
import { test } from "@playwright/test";
import xml2js from "xml2js";

const ROOT = path.resolve(".");
const DATA_DIR = path.join(ROOT, "data");
const SCREENSHOTS_DIR = path.join(DATA_DIR, "screenshots");
const REMOTE_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "remote");
const LOCAL_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "local");
const SITE_MAP_URL = "https://oneweb.net/sitemap.xml";

const get_urls_from_sitemap = async () => {
  const sitemap_path = path.join(DATA_DIR, "sitemap.xml");
  const sitemap = fs.readFileSync(sitemap_path); // await fetch(siteMapURL);
  const parser = new xml2js.Parser();
  const xml = await parser.parseStringPromise(sitemap); // siteMap.text();
  const urlobjects = xml.urlset.url;
  const urls = urlobjects.map((url) => url.loc).flat();

  return urls;
};

const url_to_filename = (url, dirname) => {
  const name = url
    .replace(/https:\/\//g, "")
    .trimRight("/")
    .replace(/\./g, "-")
    .replace(/\//g, "-");

  return path.join(dirname, `${name}-${Date.now()}.png`);
};

const take_screenshot = async (page, url, remote = false) => {
  const directory = remote ? REMOTE_SCREENSHOT_DIR : LOCAL_SCREENSHOT_DIR;
  const file_path = url_to_filename(url, directory);

  await page.goto(url);

  return await page.screenshot({
    path: file_path,
    fullPage: true,
  });
};

const with_browser_page = async (fn) => {
  let browser = await chromium.launch();
  let page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1080 });

  await fn(page);

  await browser.close();
};

const main = async (page) => {
  // with_browser_page(async (page) => {
  //   const urls = await get_urls_from_sitemap();

  //   for (const url of urls) {
  //     await take_screenshot(page, url, true);
  //   }

  //   console.log(urls);
  // });
  // const urls = await get_urls_from_sitemap();
  const urls = ["https://oneweb.net/"];

  for (const url of urls) {
    await take_screenshot(page, url, true);
  }

  console.log(urls);
};

test("test", async ({ page }) => {
  main(page);
});
