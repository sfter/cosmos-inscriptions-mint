import { SigningStargateClient } from "@cosmjs/stargate";
import {
  NATIVE_DENOM,
  NATIVE_PRICE_USD,
  UNATIVE_PER_NATIVE,
} from "../config.js";

export const getAccountBalance = async (
  /** @type {SigningStargateClient}*/ signingClient,
  /** @type {string} */ address
) => {
  const balances = await signingClient.getAllBalances(address);
  const uNativeBalance = balances.find((coin) => coin.denom === NATIVE_DENOM);
  const uNativeAmount = uNativeBalance ? parseFloat(uNativeBalance?.amount) : 0;
  const nativeAmount = uNativeAmount / UNATIVE_PER_NATIVE;

  const usdAmount = Math.round(nativeAmount * NATIVE_PRICE_USD * 100) / 100;

  return { nativeAmount, usdAmount };
};
