import {
  ADDRESS_PREFIX,
  FEE_NATIVE,
  GAS,
  INJ_GRPC,
  NATIVE_DENOM,
  UNATIVE_PER_NATIVE,
} from "../config.js";

import {
  MsgSend,
  createTransaction,
  TxGrpcClient,
  ChainGrpcAuthApi,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";

export const sendTokens = async (params) => {
  const { signingClient, privateKey, fromAddress, toAddress, memo, amount } =
      params;

  const fee = Math.round(FEE_NATIVE * UNATIVE_PER_NATIVE).toString();

  // @ts-ignore
  if (ADDRESS_PREFIX === "celestia") {
    const { transactionHash } = await signingClient.sendTokens(
        fromAddress,
        toAddress,
        [{ denom: NATIVE_DENOM, amount }],
        { amount: [{ denom: NATIVE_DENOM, amount: fee }], gas: GAS.toString() },
        memo || ""
    );

    return { transactionHash }; // @ts-ignore
  } else if (ADDRESS_PREFIX === "inj") {
    const accountDetails = await new ChainGrpcAuthApi(INJ_GRPC).fetchAccount(
        fromAddress
    );

    const msg = MsgSend.fromJSON({
      amount: { amount, denom: NATIVE_DENOM },
      srcInjectiveAddress: fromAddress,
      dstInjectiveAddress: toAddress,
    });

    const { signBytes, txRaw } = createTransaction({
      message: msg,
      memo: memo || "",
      fee: {
        amount: [{ amount: fee, denom: NATIVE_DENOM }],
        gas: GAS.toString(),
      },
      pubKey: privateKey.toPublicKey().toBase64(),
      sequence: accountDetails.baseAccount.sequence,
      accountNumber: accountDetails.baseAccount.accountNumber,
      chainId: ChainId.Mainnet,
    });

    const signature = await privateKey.sign(Buffer.from(signBytes));
    txRaw.signatures = [signature];

    const txResponse = await new TxGrpcClient(INJ_GRPC).broadcast(txRaw);

    return { transactionHash: txResponse.txHash };
  }

  throw new Error(`address prefix is not defined ${ADDRESS_PREFIX}`);
};
