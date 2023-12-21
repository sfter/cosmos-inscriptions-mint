import fs from "fs";
import path from "path";
import { logger } from "./logger.js";

/**
 * Create folders and files based on the given paths.
 * @param {string[]} paths - Array of paths to create.
 */
export const initializeFilesAndFolders = (paths) => {
  paths.forEach((filePath) => {
    const absolutePath = path.resolve(filePath);

    if (fs.existsSync(absolutePath)) return;

    const isDirectory = path.extname(filePath) === "";

    if (isDirectory) {
      fs.mkdirSync(absolutePath, { recursive: true });
      logger.info(`Directory created: ${absolutePath}`);
      return;
    }

    const dirname = path.dirname(absolutePath);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
      logger.info(`Directory created: ${dirname}`);
    }

    fs.writeFileSync(absolutePath, "", "utf-8");
    logger.info(`File created: ${absolutePath}`);
  });
};
