import fs from "node:fs";

import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

import config from "./config.js";

const compare_images = (remote, local) => {
  try {
    const img1 = PNG.sync.read(fs.readFileSync(remote));
    const img2 = PNG.sync.read(fs.readFileSync(local));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    return pixelmatch(img1.data, img2.data, diff.data, width, height, {
      threshold: config.IMAGE_DIFFERENCE_THRESHOLD,
    });
  } catch (error) {
    console.error(error);
  }
};

export default compare_images;
