import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

import { fileNameNowPrefix, writeFile } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import { initializeFilesAndFolders } from "../src/initializeFilesAndFolders.js";
import { ADDRESS_PREFIX } from "../config.js";

const { generate } = DirectSecp256k1HdWallet;

const main = async () => {
  const length = parseInt(process.argv[2]) || 10;

  const accounts = await Promise.all(
    Array.from({ length }).map(async () => {
      const signer = await generate(12, { prefix: ADDRESS_PREFIX });

      const mnemonic = signer.mnemonic;
      const account = await signer.getAccounts();
      const address = account[0].address;

      return { mnemonic, address };
    })
  );

  const time = fileNameNowPrefix();

  const FILE_ACCOUNTS = `output/accounts_${time}.txt`;
  const FILE_MNEMONICS = `output/mnemonics_${time}.txt`;
  const FILE_ADDRESSES = `output/addresses_${time}.txt`;

  initializeFilesAndFolders([FILE_ACCOUNTS, FILE_MNEMONICS, FILE_ADDRESSES]);

  writeFile(
    FILE_ACCOUNTS,
    accounts.map(({ mnemonic, address }) => `${mnemonic},${address}`).join("\n")
  );

  writeFile(
    FILE_MNEMONICS,
    accounts.map(({ mnemonic }) => `${mnemonic}`).join("\n")
  );

  writeFile(
    FILE_ADDRESSES,
    accounts.map(({ address }) => `${address}`).join("\n")
  );

  logger.info(`generated ${length} addresses ${FILE_ACCOUNTS}`);
};

main();
