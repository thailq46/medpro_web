import http from "@/apiRequest/http";

interface IPaymentBody {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  signature: string;
}

const path = {
  root: "/payment",
};

const apiPayment = {
  payment: (price: number) => http.post<IPaymentBody>(path.root, {price}),
};

export default apiPayment;
