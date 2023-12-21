import { sleep } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import {
  ADDRESS_LENGTH,
  ADDRESS_PREFIX,
  EXPLORER,
  LEAVE_NATIVE_ON_ACCOUNT,
  NATIVE_TICK,
  SLEEP_BETWEEN_DISPATCH_SEC,
  UNATIVE_PER_NATIVE,
  WITHDRAW_EXCHANGE_ADDRESS,
} from "../config.js";
import { getAccount } from "../src/getAccount.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";
import { sendTokens } from "../src/sendTokens.js";

const main = async () => {
  if (
    !WITHDRAW_EXCHANGE_ADDRESS.startsWith(ADDRESS_PREFIX) ||
    WITHDRAW_EXCHANGE_ADDRESS.length !== ADDRESS_LENGTH
  ) {
    logger.error(`${WITHDRAW_EXCHANGE_ADDRESS} exchange address is not valid`);
    return;
  }

  const accounts = getAccountsFromFile();

  for (const { mnemonic } of accounts) {
    const { address, nativeAmount, signingClient, usdAmount, InjPrivateKey } =
      await getAccount(mnemonic);
    try {
      logger.info(
        `${address} - ${nativeAmount} ${NATIVE_TICK} ($${usdAmount})`
      );

      const { transactionHash } = await sendTokens({
        signingClient,
        privateKey: InjPrivateKey,
        fromAddress: address,
        toAddress: WITHDRAW_EXCHANGE_ADDRESS,
        amount: Math.round(
          (nativeAmount - LEAVE_NATIVE_ON_ACCOUNT) * UNATIVE_PER_NATIVE
        ).toString(),
      });

      const txUrl = `${EXPLORER}/${transactionHash}`;

      logger.info(`sent to ${address} - ${txUrl}`);

      await sleep(SLEEP_BETWEEN_DISPATCH_SEC);
    } catch (error) {
      logger.error(`${address} error - ${error?.message || "undefined error"}`);
    }
  }

  logger.info("done");
};

main();
