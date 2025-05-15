import { callAPI, HttpMethod } from "./apiClient";
import { ServiceRoutes } from "./ServiceRoutes";

export async function getBalance() {
  const res = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.payment}/wallets/balance`,
  });

  return res?.result;
}

export async function getMyReceipts({page, filter}) {
  const data = await callAPI({
    method: HttpMethod.GET,
    url: `${ServiceRoutes.payment}/receipts/me`,
    params: {...page, ...filter}
  });

  return data
}

export async function deleteReceipt(receiptId){
  const data = await callAPI({
    method: HttpMethod.DELETE,
    url: `${ServiceRoutes.payment}/receipts/${receiptId}`,
  })

  return data?.result;
}

export async function createReceipt(dataForm){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.payment}/receipts`,
    data: dataForm
  })

  return data?.result;
}

export async function createSession(paymentRequest){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.payment}/receipts/create-session`,
    data: paymentRequest
  })

  return data;
}

export async function validateSession(receiptId){
  const data = await callAPI({
    method: HttpMethod.POST,
    url: `${ServiceRoutes.payment}/receipts/validate-session/${receiptId}`,
  })

  return data;
}