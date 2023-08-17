import fs from "fs";

import axios from "axios";
import xml2js from "xml2js";

import config from "./config.js";

export const get_sitemap = async () => {
  try {
    const sitemap = await axios.get(config.SITEMAP_URL, {
      headers: config.HEADERS,
    });

    return fs.writeFileSync(config.SITEMAP_PATH, sitemap.data);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const get_urls_from_sitemap = async () => {
  const sitemap = fs.readFileSync(config.SITEMAP_PATH);
  const parser = new xml2js.Parser();
  const xml = await parser.parseStringPromise(sitemap);
  const urlobjects = xml.urlset.url;
  const urls = urlobjects.map((url) => url.loc).flat();

  return urls;
};
