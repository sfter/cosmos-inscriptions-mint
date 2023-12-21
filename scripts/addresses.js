import { fileNameNowPrefix, writeFile } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import { getAccount } from "../src/getAccount.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";
import { initializeFilesAndFolders } from "../src/initializeFilesAndFolders.js";

const main = async () => {
  const accounts = getAccountsFromFile();

  const result = [];

  for (const { mnemonic } of accounts) {
    const { address } = await getAccount(mnemonic);
    result.push({ address, mnemonic });
  }

  const time = fileNameNowPrefix();

  const FILE_ACCOUNTS = `output/accounts_${time}.txt`;
  const FILE_MNEMONICS = `output/mnemonics_${time}.txt`;
  const FILE_ADDRESSES = `output/addresses_${time}.txt`;

  initializeFilesAndFolders([FILE_ACCOUNTS, FILE_MNEMONICS, FILE_ADDRESSES]);

  writeFile(
    FILE_ACCOUNTS,
    result.map(({ mnemonic, address }) => `${mnemonic},${address}`).join("\n")
  );

  writeFile(
    FILE_MNEMONICS,
    result.map(({ mnemonic }) => `${mnemonic}`).join("\n")
  );

  writeFile(
    FILE_ADDRESSES,
    result.map(({ address }) => `${address}`).join("\n")
  );

  logger.info(`added ${result.length} addresses ${FILE_ACCOUNTS}`);
};

main();
