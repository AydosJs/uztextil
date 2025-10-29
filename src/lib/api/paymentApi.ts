import { customInstance } from '../api-client';
import type { PaymentCheckRequest } from './model/paymentCheckRequest';

export interface PaymentCheckResponse {
  success: boolean;
  message?: string;
}

export const checkPaymentStatus = async (data: PaymentCheckRequest): Promise<PaymentCheckResponse> => {
  return customInstance<PaymentCheckResponse>({
    url: '/api/v1/payment/check-payment-status/',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  });
};
