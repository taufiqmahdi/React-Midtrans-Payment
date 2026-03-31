import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface CreateTransactionPayload {
  order_id: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface TransactionResponse {
  snap_token: string;
  redirect_url: string;
}

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<TransactionResponse> => {
  const { data } = await api.post<TransactionResponse>(
    "/transaction",
    payload
  );
  return data;
};