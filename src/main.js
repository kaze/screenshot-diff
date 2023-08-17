import config from "./config.js";
import { take_screenshots, compare_screenshots } from "./screenshots.js";
import { get_sitemap, get_urls_from_sitemap } from "./sitemap.js";
import { clear_data } from "./utils.js";

const main = async () => {
  await clear_data(config.DATA_DIR);

  await get_sitemap();
  const urls = await get_urls_from_sitemap();

  for (const remote of [true, false]) {
    await take_screenshots(urls, remote);
  }

  await compare_screenshots();
};

main();
