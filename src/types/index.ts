export type UserRole = 'BUSINESS_OWNER' | 'CUSTOMER';

export interface Business {
  id: string;
  slug: string; // e.g. 'rahul-fitness', 'bright-academy'
  name: string;
  tagline: string;
  description: string;
  category: 'FITNESS' | 'EDUCATION' | 'SOFTWARE' | 'SALON' | 'SERVICES' | 'OTHER';
  ownerId: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  logoText: string;
  accentColor?: string;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
  platformPlan: 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';
  autoApproveSubscriptions: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile: string;
  businessId?: string; // Which business they own or are customer of
  companyName?: string;
  address?: string;
  gstin?: string;
  registeredAt: string;
}

export interface Customer {
  id: string;
  businessId: string; // Multi-tenant isolation key
  name: string;
  email: string;
  mobile: string;
  company?: string;
  address: string;
  gstin?: string;
  registeredAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  notes?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
  description: string;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
  billingType: 'PER_MONTH' | 'ONE_TIME';
  description?: string;
}

export interface Product {
  id: string;
  businessId: string; // Multi-tenant isolation key
  name: string;
  type: 'SOFTWARE' | 'SERVICE' | 'PHYSICAL' | 'USAGE_BASED';
  salesPrice: number;
  costPrice: number;
  description: string;
  notes?: string;
  variants: ProductVariant[];
  addOns: ProductAddOn[];
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export type BillingFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

export interface SubscriptionPlan {
  id: string;
  businessId: string; // Multi-tenant isolation key
  productId: string;
  productName: string;
  name: string;
  description: string;
  price: number; // Base price in ₹
  billingFrequency: BillingFrequency;
  pricingModel: 'FIXED' | 'PER_USER' | 'ADD_ON_BASED';
  minQuantity: number;
  startDate: string;
  endDate?: string;
  autoRenewal: boolean;
  pausePolicy: string;
  earlyCancellationPolicy: string;
  renewalPolicy: string;
  features: string[];
  isPopular?: boolean;
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  businessId: string; // Multi-tenant isolation key
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discountId?: string;
  discountAmount: number;
  taxRate: number; // percentage, e.g. 18
  taxAmount: number;
  totalAmount: number;
  validityDate: string;
  status: QuotationStatus;
  notes?: string;
  createdAt: string;
}

export type SubscriptionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SubscriptionRequest {
  id: string;
  businessId: string; // Multi-tenant isolation key
  planId: string;
  planName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  quantity: number;
  billingFrequency: BillingFrequency;
  amount: number;
  selectedAddOns: string[];
  status: SubscriptionRequestStatus;
  rejectionReason?: string;
  requestedAt: string;
  approvedAt?: string;
}

export type SubscriptionStatus =
  | 'DRAFT'
  | 'QUOTATION'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'PAST_DUE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CLOSED';

export interface SubscriptionTimelineItem {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actor: string;
}

export interface Subscription {
  id: string;
  businessId: string; // Multi-tenant isolation key
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
  selectedAddOns: string[]; // AddOn IDs
  startDate: string;
  expiryDate: string;
  billingFrequency: BillingFrequency;
  amount: number; // Regular billing amount
  nextBillingDate: string;
  autoRenewal: boolean;
  status: SubscriptionStatus;
  lastBilledPeriod?: string; // e.g. '2026-10'
  activityTimeline: SubscriptionTimelineItem[];
  cancelReason?: string;
  pauseReason?: string;
}

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type?: 'BASE_PLAN' | 'VARIANT' | 'ADD_ON' | 'DISCOUNT' | 'TAX';
}

export interface Invoice {
  id: string;
  businessId: string; // Multi-tenant isolation key
  invoiceNumber: string;
  subscriptionId: string;
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerGstin?: string;
  billingPeriod: string; // e.g. '01 Oct 2026 - 31 Oct 2026'
  periodKey: string; // e.g. 'SUB-2026-001_2026-10' (Unique Duplicate Shield Key)
  invoiceDate: string;
  dueDate: string;
  productLines: InvoiceLineItem[];
  basePrice: number;
  addOnsTotal: number;
  discountAmount: number;
  discountCode?: string;
  subtotal: number;
  taxRate: number; // e.g. 18%
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
}

export type PaymentMethod = 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CHEQUE';

export interface Payment {
  id: string;
  businessId: string; // Multi-tenant isolation key
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionReference: string;
  notes?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Discount {
  id: string;
  businessId: string; // Multi-tenant isolation key
  code: string;
  title: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number; // e.g. 20 for 20% or 500 for ₹500
  minPurchase: number;
  minQuantity: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  scope: 'SUBSCRIPTION_WIDE' | 'PRODUCT_SPECIFIC';
  applicableProductIds?: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED';
}

export interface BillingEngineRunDetail {
  subscriptionId: string;
  subscriptionNumber: string;
  customerName: string;
  planName: string;
  status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
  reason: string;
  invoiceNumber?: string;
  amount?: number;
  periodKey?: string;
}

export interface BillingEngineRunHistory {
  id: string;
  businessId: string; // Multi-tenant isolation key
  timestamp: string;
  totalEvaluated: number;
  successful: number;
  skipped: number;
  failed: number;
  totalBilledAmount: number;
  details: BillingEngineRunDetail[];
}

export interface BusinessSettings {
  businessId: string;
  businessName: string;
  businessLogoText: string;
  businessEmail: string;
  mobile: string;
  address: string;
  gstin: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  paymentTerms: string;
  defaultBillingCadence: BillingFrequency;
  autoGenerateInvoices: boolean;
  duplicateShieldStrict: boolean;
}
