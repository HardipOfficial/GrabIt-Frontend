import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
}

export interface PaymentResponse {
  success: boolean;
  order?: RazorpayOrder;
  keyId?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/payment';

  constructor(private http: HttpClient) { }

  /**
   * Create a payment order with Razorpay
   * @param amount Amount in rupees (will be converted to paise in backend)
   * @returns Observable of RazorpayOrder details and Razorpay key
   */
  createPaymentOrder(amount: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/create-payment`, {
      amount: amount
    });
  }

  /**
   * Open Razorpay payment modal
   * @param orderDetails Razorpay order details
   * @param keyId Razorpay public key
   * @param customerEmail Customer email
   * @param customerName Customer name
   * @param onSuccess Callback on successful payment
   * @param onFailure Callback on failed payment
   */
  openRazorpayModal(
    orderDetails: RazorpayOrder,
    keyId: string,
    customerEmail: string,
    customerName: string,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void
  ): void {
    if (!keyId) {
      onFailure({ error: 'Razorpay key not available' });
      return;
    }

    const options = {
      key: keyId,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'Grocery Store',
      description: 'Order Payment',
      order_id: orderDetails.id,
      handler: (response: any) => {
        onSuccess(response);
      },
      prefill: {
        name: customerName,
        email: customerEmail
      },
      theme: {
        color: '#3f51b5'
      },
      modal: {
        ondismiss: () => {
          onFailure({ error: 'Payment modal closed' });
        }
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }

  /**
   * Verify payment signature (if backend provides endpoint)
   * @param paymentData Payment verification data
   * @returns Observable confirming payment verification
   */
  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, paymentData);
  }
}
