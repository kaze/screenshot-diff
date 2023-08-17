import path from "path";

import "dotenv/config";

// urls
// ------------------------------------------------------------------------- //

const REMOTE_BASE_URL = process.env.REMOTE_BASE_URL;
const LOCAL_BASE_URL = process.env.REMOTE_BASE_URL;
const SITEMAP_URL = `${REMOTE_BASE_URL}/${process.env.SITEMAP_URL_PATH}`;

// paths
// ------------------------------------------------------------------------- //

const ROOT = path.resolve(".");
const DATA_DIR = path.join(ROOT, ".data");
const SITEMAP_PATH = path.join(DATA_DIR, "sitemap.xml");
const SCREENSHOTS_DIR = path.join(DATA_DIR, "screenshots");
const REMOTE_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "remote");
const LOCAL_SCREENSHOT_DIR = path.join(SCREENSHOTS_DIR, "local");

// requests
// ------------------------------------------------------------------------- //

const HEADERS = {
  "accept-encoding": "*",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/png,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  referer: "https://example.net/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
};

// image diff
// ------------------------------------------------------------------------- //

const IMAGE_DIFFERENCE_THRESHOLD = 0.1;

// exports
// ------------------------------------------------------------------------- //

export default {
  REMOTE_BASE_URL,
  LOCAL_BASE_URL,
  SITEMAP_URL,
  ROOT,
  DATA_DIR,
  SITEMAP_PATH,
  SCREENSHOTS_DIR,
  REMOTE_SCREENSHOT_DIR,
  LOCAL_SCREENSHOT_DIR,
  HEADERS,
  IMAGE_DIFFERENCE_THRESHOLD,
};
