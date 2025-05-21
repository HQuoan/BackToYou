import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getUserBalanceWithEmail(email){
  const res = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.payment}/wallets/balance/${email}`,
  });

  return res?.result;
}


export async function adjustFunds(formData){
  const res = await callAPI({
    method: HttpMethod.PUT,
    url: `${ServiceRoutes.payment}/wallets/funds`,
    data:formData,
  });

  return res?.result;
}

export async function getPaymentTotal(lastDay){
  const res = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.payment}/receipts/total/${lastDay}`,
  });

  return res;
}

