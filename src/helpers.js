import fs from "fs";

const encoding = "utf-8";

export const readdir = (/** @type {fs.PathLike} */ dir) => fs.readdirSync(dir);

export const readFile = (/** @type {fs.PathOrFileDescriptor} */ name) =>
  fs.readFileSync(name, { encoding });

export const readByLine = (/** @type {string} */ name) =>
  readFile(name).split(/\r?\n/).filter(Boolean);

export const writeFile = (
  /** @type {fs.PathOrFileDescriptor} */ name,
  /** @type {string | Uint8Array} */ data
) => fs.writeFileSync(name, data, { encoding });

export const appendFile = (
  /** @type {fs.PathOrFileDescriptor} */ name,
  /** @type {string | Uint8Array} */ data
) => fs.appendFileSync(name, data, { encoding });

export const sleep = async (/** @type {number} */ sec) =>
  new Promise((r) => setTimeout(r, sec * 1000));

export const fileNameNowPrefix = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};
