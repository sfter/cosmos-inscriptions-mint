import axios from "axios";
import { logger } from "../src/logger.js";
import { appendFile, fileNameNowPrefix, sleep } from "../src/helpers.js";
import { MINTED_API_URL, SLEEP_BETWEEN_CHECK_MINTED_SEC } from "../config.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";
import { getAccount } from "../src/getAccount.js";

const checkCiasBalance = async (address) => {
  try {
    const url = `${MINTED_API_URL}/${address}`;
    const response = await axios.get(url);
    return [response.data?.balance, response.data?.rank];
  } catch (error) {
    logger.error(error.message);
    return [error.message || "undefined error"];
  }
};

const main = async () => {
  if (!MINTED_API_URL) {
    logger.error("this module currently does not work in this network");
    return;
  }

  const FOLDER_OUTPUT = `./output/minted_${fileNameNowPrefix()}.txt`;

  const accounts = getAccountsFromFile();

  let errorsCount = 0;
  let mintedSum = 0;

  for (const account of accounts) {
    let address = account.address;

    if (!address) {
      const chainAccount = await getAccount(account.mnemonic);
      address = chainAccount.address;
    }

    try {
      const result = await checkCiasBalance(address);
      console.log(`${address} - balance: ${result[0]}, rank: ${result[1]}`);
      appendFile(`${FOLDER_OUTPUT}`, `${address},${result.join(",")}\n`);
      errorsCount = 0;
      if (typeof result[0] === "number") {
        mintedSum += result[0];
      }
    } catch (error) {
      logger.error(`${address} error - ${error.message}`);
      appendFile(`${FOLDER_OUTPUT}`, `${address},${error.message}\n`);
      await sleep(SLEEP_BETWEEN_CHECK_MINTED_SEC * errorsCount);
      errorsCount += 1;
    }

    await sleep(SLEEP_BETWEEN_CHECK_MINTED_SEC);
  }

  logger.info(`Minted sum: ${mintedSum}`);
};

main();
