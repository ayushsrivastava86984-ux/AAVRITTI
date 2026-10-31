import {
  Business,
  Customer,
  Product,
  SubscriptionPlan,
  Quotation,
  Subscription,
  SubscriptionRequest,
  Invoice,
  Payment,
  Discount,
  BusinessSettings,
  User,
  BillingEngineRunHistory,
} from '../types';

export const initialBusinesses: Business[] = [];
export const initialUsers: User[] = [];
export const initialCustomers: Customer[] = [];
export const initialProducts: Product[] = [];
export const initialPlans: SubscriptionPlan[] = [];
export const initialQuotations: Quotation[] = [];
export const initialSubscriptions: Subscription[] = [];
export const initialSubscriptionRequests: SubscriptionRequest[] = [];
export const initialInvoices: Invoice[] = [];
export const initialPayments: Payment[] = [];
export const initialDiscounts: Discount[] = [];
export const initialBillingHistory: BillingEngineRunHistory[] = [];

export const defaultBusinessSettings: BusinessSettings = {
  businessId: '',
  businessName: 'My Business',
  businessLogoText: 'AV',
  businessEmail: 'contact@example.com',
  mobile: '',
  address: '',
  gstin: '',
  currency: '₹',
  taxRate: 18,
  invoicePrefix: 'INV',
  paymentTerms: 'Due on Receipt',
  defaultBillingCadence: 'MONTHLY',
  autoGenerateInvoices: true,
  duplicateShieldStrict: true,
};

export const initialBusinessSettings: Record<string, BusinessSettings> = {};
