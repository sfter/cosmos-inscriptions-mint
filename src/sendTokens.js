import {
  ADDRESS_PREFIX,
  EXPLORER,
  FEE_NATIVE,
  GAS,
  MEMO,
  NATIVE_DENOM,
  UNATIVE_PER_NATIVE,
} from "../config.js";

import { getNetworkInfo, Network } from "@injectivelabs/networks";

import {
  MsgSend,
  TxClient,
  ChainRestAuthApi,
  createTransaction,
  TxGrpcClient,
} from "@injectivelabs/sdk-ts";
import { logger } from "./logger.js";

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
      MEMO
    );

    return { transactionHash }; // @ts-ignore
  } else if (ADDRESS_PREFIX === "inj") {
    const network = getNetworkInfo(Network.Mainnet);

    const publicKey = privateKey.toPublicKey().toBase64();

    const accountDetails = await new ChainRestAuthApi(
      network.rest
    ).fetchAccount(fromAddress);

    const msg = MsgSend.fromJSON({
      amount: { amount, denom: NATIVE_DENOM },
      srcInjectiveAddress: fromAddress,
      dstInjectiveAddress: toAddress,
    });

    const { signBytes, txRaw } = createTransaction({
      message: msg,
      memo,
      fee: {
        amount: [
          {
            amount: fee,
            denom: NATIVE_DENOM,
          },
        ],
        gas: GAS.toString(),
      },
      pubKey: publicKey,
      sequence: parseInt(accountDetails.account.base_account.sequence, 10),
      accountNumber: parseInt(
        accountDetails.account.base_account.account_number,
        10
      ),
      chainId: network.chainId,
    });

    const signature = await privateKey.sign(Buffer.from(signBytes));

    txRaw.signatures = [signature];

    const url = `${EXPLORER}/${TxClient.hash(txRaw)}`;
    logger.info(`preliminary hash: ${url}`);

    const txService = new TxGrpcClient(network.grpc);

    // const simulationResponse = await txService.simulate(txRaw);
    // console.log(
    //   `Transaction simulation response: ${JSON.stringify(
    //     simulationResponse.gasInfo
    //   )}`
    // );

    const txResponse = await txService.broadcast(txRaw);

    return { transactionHash: TxClient.hash(txRaw) };
  }

  throw new Error(`address prefix is not defined ${ADDRESS_PREFIX}`);
};
