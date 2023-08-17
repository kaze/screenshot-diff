import fs from "fs";
import path from "path";
import { exec } from "child_process";

import axios from "axios";
import { chromium } from "playwright";
import { test, expect } from "@playwright/test";
import xml2js from "xml2js";

// constants
// ------------------------------------------------------------------------- //

const REMOTE_BASE_URL = "https://oneweb.net/";
const LOCAL_BASE_URL = "http://oneweb.test/";
const SITEMAP_URL = `${REMOTE_BASE_URL}/sitemap.xml`;

const ROOT = path.resolve(".");
const DATA_DIR = path.join(ROOT, ".data");
const SITEMAP_PATH = path.join(DATA_DIR, "sitemap.xml");
const SCREENSHOTS_DIR = path.join(DATA_DIR, "screenshots");
const REMOTE_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "remote");
const LOCAL_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "local");

const HEADERS = {
  "accept-encoding": "*",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/png,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  referer: "https://oneweb.net/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
};

// helpers
// ------------------------------------------------------------------------- //

const sleep = async (ms) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const shell = async (command) => {
  try {
    return await exec(command);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const clear_data = async (directory) => {
  await shell(`rm -rf ${directory}`);
  await sleep(2000);
  await shell(`mkdir -p ${directory}`);
};

const get_sitemap = async () => {
  try {
    const sitemap = await axios.get(SITEMAP_URL, { headers: HEADERS });

    return fs.writeFileSync(SITEMAP_PATH, sitemap.data);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const get_urls_from_sitemap = async () => {
  const sitemap = fs.readFileSync(SITEMAP_PATH);
  const parser = new xml2js.Parser();
  const xml = await parser.parseStringPromise(sitemap);
  const urlobjects = xml.urlset.url;
  const urls = urlobjects.map((url) => url.loc).flat();

  return urls;
};

const url_to_filename = (url, remote) => {
  const to_replace = remote ? REMOTE_BASE_URL : LOCAL_BASE_URL;
  const directory = remote ? REMOTE_SCREENSHOT_DIR : LOCAL_SCREENSHOT_DIR;
  url = url.replace(to_replace, "");
  let name = url.trimRight("/").replace(/\//g, "-");

  // the root page is a special case, because we totally emptied its name
  if (name === "") {
    name = "root";
  }

  return path.join(directory, `${name}--${Date.now()}.png`);
};

const take_screenshot = async (page, url, remote) => {
  if (!remote) {
    url.replace(REMOTE_BASE_URL, LOCAL_BASE_URL);
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
  let page = await browser.newPage({ extraHTTPHeaders: HEADERS });
  await page.setViewportSize({ width: 1280, height: 1080 });

  await fn(page);

  await browser.close();
};

const get_all_screenshots = async (urls, remote) => {
  with_browser_page(async (page) => {
    for (const url of urls) {
      await take_screenshot(page, url, remote);
    }
  });
};

// main function
// ------------------------------------------------------------------------- //

const main = async () => {
  // cleaning up after the previous run
  await clear_data(DATA_DIR);

  // get remote urls from sitemap
  await get_sitemap();
  const urls = await get_urls_from_sitemap();

  // get screenshots of full pages from both remote and local sites
  for (const remote of [true, false]) {
    await get_all_screenshots(urls, remote);
  }

  // compare screenshots
};

// run main
// ------------------------------------------------------------------------- //

main();
