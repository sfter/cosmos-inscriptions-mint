import { readByLine } from "./helpers.js";

import { FILE_ACCOUNTS } from "../config.js";
import { initializeFilesAndFolders } from "./initializeFilesAndFolders.js";

export const getAccountsFromFile = () => {
  initializeFilesAndFolders([FILE_ACCOUNTS]);

  const accounts = readByLine(FILE_ACCOUNTS);

  if (!accounts.length) throw new Error(`${FILE_ACCOUNTS} file is empty`);

  return accounts.map((account) => {
    const [mnemonic, address] = account.split(",");
    return { mnemonic, address };
  });
};
