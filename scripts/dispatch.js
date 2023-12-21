import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

import { sleep } from "../src/helpers.js";
import { logger } from "../src/logger.js";
import {
  ADDRESS_PREFIX,
  EXPLORER,
  NATIVE_TICK,
  RPC,
  SEND_NATIVE_TOKENS_PER_ACCOUNT,
  SLEEP_BETWEEN_DISPATCH_SEC,
  UNATIVE_PER_NATIVE,
} from "../config.js";
import { getAccount } from "../src/getAccount.js";
import { getAccountsFromFile } from "../src/getAccountsFromFile.js";
import { sendTokens } from "../src/sendTokens.js";

const { fromMnemonic } = DirectSecp256k1HdWallet;
const { connectWithSigner } = SigningStargateClient;

const main = async () => {
  const accountsData = getAccountsFromFile();

  const accounts = [];

  for (const { mnemonic } of accountsData) {
    accounts.push(await getAccount(mnemonic));
  }

  const [mainAccount, ...accountsToDispatch] = accounts;

  const signer = await fromMnemonic(mainAccount.mnemonic, {
    prefix: ADDRESS_PREFIX,
  });

  const signingClient = await connectWithSigner(RPC, signer);

  logger.info(
      `main account balance - ${mainAccount.address} - ${mainAccount.nativeAmount} ${NATIVE_TICK} ($${mainAccount.usdAmount})`
  );

  for (const accountToDispatch of accountsToDispatch) {
    try {
      const { transactionHash } = await sendTokens({
        signingClient,
        privateKey: mainAccount.InjPrivateKey,
        fromAddress: mainAccount.address,
        toAddress: accountToDispatch.address,
        amount: Math.round(
            SEND_NATIVE_TOKENS_PER_ACCOUNT * UNATIVE_PER_NATIVE
        ).toString(),
      });

      const txUrl = `${EXPLORER}/${transactionHash}`;

      logger.info(
          `${SEND_NATIVE_TOKENS_PER_ACCOUNT} ${NATIVE_TICK} sent to ${accountToDispatch.address} - ${txUrl}`
      );

      const currentMainAccount = await getAccount(mainAccount.mnemonic);

      logger.info(
          `main account balance - ${currentMainAccount.nativeAmount} ${NATIVE_TICK} ($${currentMainAccount.usdAmount})`
      );

      if (currentMainAccount.nativeAmount < SEND_NATIVE_TOKENS_PER_ACCOUNT) {
        logger.error(`main account balance is too low to dispatch`);
        return;
      }
    } catch (error) {
      logger.error(
          `${accountToDispatch.address} error - ${
              error?.message || "undefined error"
          }`
      );
    }

    await sleep(SLEEP_BETWEEN_DISPATCH_SEC);
  }

  logger.info("done");
};

main();
