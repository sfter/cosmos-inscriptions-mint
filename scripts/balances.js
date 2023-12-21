import { sleep } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import { SLEEP_BETWEEN_CHECK_BALANCES_SEC, NATIVE_TICK } from "../config.js";
import { getAccount } from "../src/getAccount.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";

const main = async () => {
  const accounts = getAccountsFromFile();

  let idx = 0;

  for (const { mnemonic } of accounts) {
    try {
      const { address, nativeAmount, usdAmount } = await getAccount(mnemonic);

      logger.info(
        `[${idx}] ${address} - ${nativeAmount} ${NATIVE_TICK} - $${usdAmount}`
      );

      await sleep(SLEEP_BETWEEN_CHECK_BALANCES_SEC);
    } catch (error) {
      logger.error(`[${idx}] - ${error.message}`);
    }
    idx += 1;
  }

  logger.info("done");
};

main();
