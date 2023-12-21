import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ADDRESS_PREFIX, RPC } from "../config.js";
import { getAccountBalance } from "./getAccountBalance.js";
import {
  InjectiveDirectEthSecp256k1Wallet,
  InjectiveStargate,
  PrivateKey,
} from "@injectivelabs/sdk-ts";

export const getAccount = async (/** @type {string} */ mnemonic) => {
  // @ts-ignore
  if (ADDRESS_PREFIX === "celestia") {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: ADDRESS_PREFIX,
    });

    const account = await signer.getAccounts();
    const address = account[0].address;
    const signingClient = await SigningStargateClient.connectWithSigner(
      RPC,
      signer
    );

    const { nativeAmount, usdAmount } = await getAccountBalance(
      signingClient,
      address
    );

    return { mnemonic, address, signingClient, nativeAmount, usdAmount };
    // @ts-ignore
  } else if (ADDRESS_PREFIX === "inj") {
    const privateKeyFromMnemonic = PrivateKey.fromMnemonic(mnemonic);
    const privateKey = privateKeyFromMnemonic.toPrivateKeyHex();

    const address = PrivateKey.fromHex(privateKey).toBech32();

    const signer = await InjectiveDirectEthSecp256k1Wallet.fromKey(
      Buffer.from(privateKey.replace("0x", ""), "hex")
    );

    const signingClient =
      await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
        RPC,
        // @ts-ignore
        signer
      );

    const { nativeAmount, usdAmount } = await getAccountBalance(
      // @ts-ignore
      signingClient,
      address
    );

    return {
      mnemonic,
      address,
      signingClient,
      nativeAmount,
      usdAmount,
      InjPrivateKey: privateKeyFromMnemonic,
    };
  }
  throw new Error(`address prefix is not defined ${ADDRESS_PREFIX}`);
};
