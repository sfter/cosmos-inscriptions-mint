import {
  EXPLORER,
  MEMO,
  MINT_AMOUNT_NATIVE, MINT_COUNT,
  NATIVE_TICK,
  SLEEP_BETWEEN_ACCOUNT_TXS_SEC,
  SLEEP_ON_GET_ACCOUNT_ERROR_SEC,
  UNATIVE_PER_NATIVE,
} from "../config.js";
import { sleep } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import { getAccount } from "../src/getAccount.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";
import { sendTokens } from "../src/sendTokens.js";

export const sendTx = async (
  /** @type {number} */ accountIdx,
  /** @type {string} */ address,
  signingClient,
  InjPrivateKey
) => {
  logger.warn(`[${accountIdx}] ${address} - start sending tx`);
  const amount = Math.round(MINT_AMOUNT_NATIVE * UNATIVE_PER_NATIVE).toString()

  const { transactionHash } = await sendTokens({
    signingClient,
    privateKey: InjPrivateKey,
    fromAddress: address,
    toAddress: address,
    memo: MEMO,
    amount: amount,
  });

  const txUrl = `${EXPLORER}/${transactionHash}`;

  logger.info(`[${accountIdx}] ${address} - ${txUrl}`);
};

const getAccountWrapped = async (
  /** @type {number} */ accountIdx,
  /** @type {string} */ mnemonic
) => {
  while (true) {
    try {
      return await getAccount(mnemonic);
    } catch (error) {
      logger.error(`[${accountIdx}] init error - ${error.message}`);
      await sleep(SLEEP_ON_GET_ACCOUNT_ERROR_SEC);
    }
  }
};

const processAccount = async (
  /** @type {number} */ accountIdx,
  /** @type {string} */ mnemonic
) => {
  const account = await getAccountWrapped(accountIdx, mnemonic);

  logger.warn(
    `[${accountIdx}] ${account.address} started - ${account.nativeAmount} ${NATIVE_TICK} ($${account.usdAmount})`
  );

  let mintCount = MINT_COUNT
  if (mintCount <= 0) {
    mintCount = 10000
  }
  for (let i = 0; i < mintCount; i++) {
    try {
      await sendTx(
          accountIdx,
          account.address,
          account.signingClient,
          account.InjPrivateKey
      );
      await sleep(SLEEP_BETWEEN_ACCOUNT_TXS_SEC);
    } catch (error) {
      logger.error(
          `[${accountIdx}] ${account.address} tx error - ${error.message}`
      );

      if (error?.message?.includes("is smaller than")) {
        logger.warn(
            `[${accountIdx}] ${account.address} remove due to small balance`
        );
        return;
      }

      await sleep(SLEEP_ON_GET_ACCOUNT_ERROR_SEC);
    }
  }
};

const main = async () => {
  const accounts = getAccountsFromFile();
  for (let idx = 0; idx < accounts.length; idx += 1) {
    processAccount(idx, accounts[idx].mnemonic);
  }
};

main();
