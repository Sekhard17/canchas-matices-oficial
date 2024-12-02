export interface PaymentFormData {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  installments: number;
  payer: {
    identification: {
      type: string;
      number: string;
    };
  };
  bin?: string;
}

export interface PaymentInitialization {
  amount: number;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
    name: string;
    surname: string;
  };
  description: string;
  metadata?: Record<string, any>;
}