import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Business,
  Customer,
  Product,
  SubscriptionPlan,
  Quotation,
  Subscription,
  SubscriptionRequest,
  Invoice,
  InvoiceLineItem,
  Payment,
  Discount,
  BusinessSettings,
  BillingEngineRunHistory,
  BillingEngineRunDetail,
  UserRole,
} from '../types';
import {
  initialBusinesses,
  initialUsers,
  initialCustomers,
  initialProducts,
  initialPlans,
  initialQuotations,
  initialSubscriptionRequests,
  initialSubscriptions,
  initialInvoices,
  initialPayments,
  initialDiscounts,
  initialBillingHistory,
  initialBusinessSettings,
  defaultBusinessSettings,
} from '../data/seedData';

interface BillingPreviewItem {
  subscription: Subscription;
  customer: Customer;
  plan: SubscriptionPlan;
  periodKey: string;
  billingPeriod: string;
  calculatedAmount: number;
  taxAmount: number;
  totalWithTax: number;
  status: 'READY' | 'SKIPPED_DUPLICATE' | 'SKIPPED_PAUSED' | 'FAILED_INVALID';
  reason: string;
}

interface AppContextType {
  // Auth & Multi-tenant Business Context
  currentUser: User | null;
  currentBusiness: Business | null;
  businesses: Business[];
  users: User[];
  setCurrentUser: (user: User | null) => void;
  setCurrentBusiness: (business: Business | null) => void;
  login: (email: string, targetRole?: UserRole, businessId?: string) => boolean;
  signupBusinessOwner: (data: {
    ownerName: string;
    email: string;
    mobile: string;
    businessName: string;
    category: Business['category'];
    address: string;
    gstin?: string;
    currency?: string;
  }) => Business;
  signupCustomerForBusiness: (
    businessId: string,
    data: { name: string; email: string; mobile: string; address?: string }
  ) => Customer;
  logout: () => void;
  quickSwitchRole: (role: UserRole, businessId?: string, email?: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Raw & Isolated Data Collections
  customers: Customer[];
  products: Product[];
  plans: SubscriptionPlan[];
  quotations: Quotation[];
  subscriptions: Subscription[];
  subscriptionRequests: SubscriptionRequest[];
  invoices: Invoice[];
  payments: Payment[];
  discounts: Discount[];
  billingHistory: BillingEngineRunHistory[];
  settings: BusinessSettings;

  // Tenant-Filtered Collections for currently active business
  tenantCustomers: Customer[];
  tenantProducts: Product[];
  tenantPlans: SubscriptionPlan[];
  tenantQuotations: Quotation[];
  tenantSubscriptions: Subscription[];
  tenantSubscriptionRequests: SubscriptionRequest[];
  tenantInvoices: Invoice[];
  tenantPayments: Payment[];
  tenantDiscounts: Discount[];
  tenantBillingHistory: BillingEngineRunHistory[];

  // Operations
  signupCustomer: (data: {
    name: string;
    email: string;
    mobile: string;
    companyName?: string;
    address?: string;
    businessId?: string;
  }) => Customer;
  addCustomer: (customer: Omit<Customer, 'id' | 'registeredAt' | 'businessId'> & { businessId?: string }) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'businessId'> & { businessId?: string }) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addPlan: (plan: Omit<SubscriptionPlan, 'id' | 'businessId'> & { businessId?: string }) => SubscriptionPlan;
  updatePlan: (id: string, plan: Partial<SubscriptionPlan>) => void;

  // Subscription Requests
  submitSubscriptionRequest: (data: {
    businessId: string;
    planId: string;
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    quantity: number;
    selectedAddOns: string[];
    payNow?: boolean;
    paymentMethod?: Payment['paymentMethod'];
    notes?: string;
  }) => { request?: SubscriptionRequest; subscription?: Subscription };
  approveSubscriptionRequest: (requestId: string) => Subscription | null;
  rejectSubscriptionRequest: (requestId: string, reason: string) => void;

  // Business management
  updateBusinessStatus: (businessId: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  updateBusinessDetails: (businessId: string, partial: Partial<Business>) => void;

  // Quotation operations
  createQuotation: (quo: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'businessId'> & { businessId?: string }) => Quotation;
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  convertQuotationToSubscription: (quotationId: string) => Subscription | null;

  // Subscription operations
  createSubscription: (sub: Omit<Subscription, 'id' | 'subscriptionNumber' | 'activityTimeline' | 'businessId'> & { businessId?: string }) => Subscription;
  updateSubscriptionStatus: (id: string, status: Subscription['status'], reason?: string) => void;
  changeSubscriptionPlan: (id: string, newPlanId: string) => void;
  renewSubscription: (id: string) => void;

  // Invoice & Payment operations
  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'businessId'> & { businessId?: string }) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  recordPayment: (paymentData: {
    customerId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference: string;
    notes?: string;
  }) => Payment;

  // Discounts & Settings
  addDiscount: (discount: Omit<Discount, 'id' | 'timesUsed' | 'businessId'> & { businessId?: string }) => Discount;
  updateDiscount: (id: string, discount: Partial<Discount>) => void;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  // Aavritti Billing Engine
  previewBillingEngine: () => BillingPreviewItem[];
  executeBillingEngine: (subscriptionIdsToProcess?: string[]) => BillingEngineRunHistory;
  retryFailedBilling: (failedDetailItems: BillingEngineRunDetail[]) => BillingEngineRunHistory;

  // UI Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalBusinessId: string | null;
  setAuthModalBusinessId: (bId: string | null) => void;
  explainBillInvoice: Invoice | null;
  setExplainBillInvoice: (invoice: Invoice | null) => void;
  pdfInvoice: Invoice | null;
  setPdfInvoice: (invoice: Invoice | null) => void;
  pdfQuotation: Quotation | null;
  setPdfQuotation: (quotation: Quotation | null) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'aavritti_v4_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    // Check for legacy demo data and purge if detected
    if (raw.includes('BIZ-RAHUL-FITNESS') || raw.includes('USR-OWNER-RAHUL')) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clean initial states (No demo data)
  const [businesses, setBusinesses] = useState<Business[]>(() =>
    loadFromStorage<Business[]>('businesses', initialBusinesses)
  );

  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage<User[]>('users', initialUsers)
  );

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage<User | null>('currentUser', null)
  );

  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(() => {
    const saved = loadFromStorage<Business | null>('currentBusiness', null);
    if (saved) return saved;
    const bList = loadFromStorage<Business[]>('businesses', initialBusinesses);
    return bList.length > 0 ? bList[0] : null;
  });

  const [activeTab, setActiveTab] = useState<string>(() =>
    loadFromStorage<string>('activeTab', 'home')
  );

  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadFromStorage<Customer[]>('customers', initialCustomers)
  );
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('products', initialProducts)
  );
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() =>
    loadFromStorage<SubscriptionPlan[]>('plans', initialPlans)
  );
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>(() =>
    loadFromStorage<SubscriptionRequest[]>('subscriptionRequests', initialSubscriptionRequests)
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    loadFromStorage<Subscription[]>('subscriptions', initialSubscriptions)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadFromStorage<Invoice[]>('invoices', initialInvoices)
  );
  const [payments, setPayments] = useState<Payment[]>(() =>
    loadFromStorage<Payment[]>('payments', initialPayments)
  );
  const [discounts, setDiscounts] = useState<Discount[]>(() =>
    loadFromStorage<Discount[]>('discounts', initialDiscounts)
  );
  const [quotations, setQuotations] = useState<Quotation[]>(() =>
    loadFromStorage<Quotation[]>('quotations', initialQuotations)
  );
  const [billingHistory, setBillingHistory] = useState<BillingEngineRunHistory[]>(() =>
    loadFromStorage<BillingEngineRunHistory[]>('billingHistory', initialBillingHistory)
  );
  const [allBusinessSettings, setAllBusinessSettings] = useState<Record<string, BusinessSettings>>(() =>
    loadFromStorage<Record<string, BusinessSettings>>('allBusinessSettings', initialBusinessSettings)
  );

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalBusinessId, setAuthModalBusinessId] = useState<string | null>(null);
  const [explainBillInvoice, setExplainBillInvoice] = useState<Invoice | null>(null);
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);
  const [pdfQuotation, setPdfQuotation] = useState<Quotation | null>(null);

  // Sync to localStorage
  useEffect(() => saveToStorage('businesses', businesses), [businesses]);
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveToStorage('currentBusiness', currentBusiness), [currentBusiness]);
  useEffect(() => saveToStorage('activeTab', activeTab), [activeTab]);
  useEffect(() => saveToStorage('customers', customers), [customers]);
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('plans', plans), [plans]);
  useEffect(() => saveToStorage('subscriptionRequests', subscriptionRequests), [subscriptionRequests]);
  useEffect(() => saveToStorage('subscriptions', subscriptions), [subscriptions]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('discounts', discounts), [discounts]);
  useEffect(() => saveToStorage('quotations', quotations), [quotations]);
  useEffect(() => saveToStorage('billingHistory', billingHistory), [billingHistory]);
  useEffect(() => saveToStorage('allBusinessSettings', allBusinessSettings), [allBusinessSettings]);

  // Active Tenant ID
  const activeBusinessId = currentBusiness?.id || (businesses.length > 0 ? businesses[0].id : '');

  // Current Business Settings
  const settings: BusinessSettings =
    (activeBusinessId ? allBusinessSettings[activeBusinessId] : null) || {
      ...defaultBusinessSettings,
      businessId: activeBusinessId,
      businessName: currentBusiness?.name || 'My Business',
      businessLogoText: currentBusiness?.logoText || 'AV',
      businessEmail: currentBusiness?.email || 'billing@example.com',
      mobile: currentBusiness?.phone || '+91 98000 00000',
      address: currentBusiness?.address || 'India',
      gstin: currentBusiness?.gstin || '',
      currency: currentBusiness?.currency || '₹',
      invoicePrefix: currentBusiness?.slug ? currentBusiness.slug.slice(0, 3).toUpperCase() : 'INV',
    };

  // Tenant-isolated Collections (Safely handles empty tenant)
  const tenantCustomers = activeBusinessId ? customers.filter((c) => c.businessId === activeBusinessId) : [];
  const tenantProducts = activeBusinessId ? products.filter((p) => p.businessId === activeBusinessId) : [];
  const tenantPlans = activeBusinessId ? plans.filter((p) => p.businessId === activeBusinessId) : [];
  const tenantQuotations = activeBusinessId ? quotations.filter((q) => q.businessId === activeBusinessId) : [];
  const tenantSubscriptions = activeBusinessId ? subscriptions.filter((s) => s.businessId === activeBusinessId) : [];
  const tenantSubscriptionRequests = activeBusinessId ? subscriptionRequests.filter((r) => r.businessId === activeBusinessId) : [];
  const tenantInvoices = activeBusinessId ? invoices.filter((i) => i.businessId === activeBusinessId) : [];
  const tenantPayments = activeBusinessId ? payments.filter((p) => p.businessId === activeBusinessId) : [];
  const tenantDiscounts = activeBusinessId ? discounts.filter((d) => d.businessId === activeBusinessId) : [];
  const tenantBillingHistory = activeBusinessId ? billingHistory.filter((h) => h.businessId === activeBusinessId) : [];

  // Authentication Operations (TWO ROLES: BUSINESS_OWNER & CUSTOMER)
  const login = (email: string, targetRole?: UserRole, businessId?: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      setCurrentUser(existing);
      if (existing.businessId) {
        const b = businesses.find((biz) => biz.id === existing.businessId);
        if (b) setCurrentBusiness(b);
      }
      if (existing.role === 'BUSINESS_OWNER') {
        setActiveTab('admin-overview');
      } else {
        setActiveTab('customer-dashboard');
      }
      return true;
    }

    // Check in customer list
    const cust = customers.find((c) => c.email.toLowerCase() === trimmedEmail);
    if (cust) {
      const b = businesses.find((biz) => biz.id === cust.businessId);
      if (b) setCurrentBusiness(b);
      const newUser: User = {
        id: `USR-${cust.id}`,
        name: cust.name,
        email: cust.email,
        role: 'CUSTOMER',
        businessId: cust.businessId,
        mobile: cust.mobile,
        companyName: cust.company,
        address: cust.address,
        registeredAt: cust.registeredAt,
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setActiveTab('customer-dashboard');
      return true;
    }

    return false;
  };

  const signupBusinessOwner = (data: {
    ownerName: string;
    email: string;
    mobile: string;
    businessName: string;
    category: Business['category'];
    address: string;
    gstin?: string;
    currency?: string;
  }) => {
    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `biz-${Date.now().toString().slice(-4)}`;
    const newBizId = `BIZ-${slug.toUpperCase()}`;
    const newOwnerId = `USR-OWNER-${Date.now()}`;

    const newBiz: Business = {
      id: newBizId,
      slug,
      name: data.businessName,
      tagline: 'Recurring Billing & Subscription Engine',
      description: `Official subscription portal for ${data.businessName}.`,
      category: data.category,
      ownerId: newOwnerId,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.mobile,
      address: data.address,
      gstin: data.gstin || '',
      logoText: (data.businessName.slice(0, 2) || 'AV').toUpperCase(),
      currency: data.currency || '₹',
      status: 'ACTIVE',
      platformPlan: 'PRO',
      autoApproveSubscriptions: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newOwnerUser: User = {
      id: newOwnerId,
      name: data.ownerName,
      email: data.email,
      role: 'BUSINESS_OWNER',
      businessId: newBizId,
      mobile: data.mobile,
      companyName: data.businessName,
      address: data.address,
      gstin: data.gstin,
      registeredAt: new Date().toISOString(),
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    setUsers((prev) => [newOwnerUser, ...prev]);
    setCurrentBusiness(newBiz);
    setCurrentUser(newOwnerUser);
    setActiveTab('admin-overview');
    return newBiz;
  };

  const signupCustomerForBusiness = (
    businessId: string,
    data: { name: string; email: string; mobile: string; address?: string }
  ) => {
    const newCustId = `CUST-${businessId ? businessId.slice(-4) : 'GEN'}-${Date.now().toString().slice(-4)}`;
    const newCust: Customer = {
      id: newCustId,
      businessId,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      company: data.name,
      address: data.address || 'Address provided at signup',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      notes: 'Self-registered customer account',
    };

    setCustomers((prev) => [newCust, ...prev]);

    const newUser: User = {
      id: `USR-${newCustId}`,
      name: data.name,
      email: data.email,
      role: 'CUSTOMER',
      businessId,
      mobile: data.mobile,
      companyName: data.name,
      address: data.address,
      registeredAt: newCust.registeredAt,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    const b = businesses.find((biz) => biz.id === businessId);
    if (b) setCurrentBusiness(b);
    setActiveTab('customer-dashboard');
    return newCust;
  };

  const signupCustomer = (data: {
    name: string;
    email: string;
    mobile: string;
    companyName?: string;
    address?: string;
    businessId?: string;
  }) => {
    const targetBizId = data.businessId || authModalBusinessId || currentBusiness?.id || (businesses[0]?.id || '');
    return signupCustomerForBusiness(targetBizId, {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const quickSwitchRole = (role: UserRole, businessId?: string, email?: string) => {
    if (role === 'BUSINESS_OWNER') {
      const b = businessId ? businesses.find((biz) => biz.id === businessId) : (currentBusiness || businesses[0] || null);
      if (b) {
        setCurrentBusiness(b);
        const ownerUser = users.find((u) => u.businessId === b.id && u.role === 'BUSINESS_OWNER');
        if (ownerUser) {
          setCurrentUser(ownerUser);
        } else {
          const fallbackUser: User = {
            id: b.ownerId || `USR-OWNER-${Date.now()}`,
            name: b.ownerName || 'Business Owner',
            email: b.email,
            role: 'BUSINESS_OWNER',
            businessId: b.id,
            mobile: b.phone,
            registeredAt: b.createdAt,
          };
          setUsers((prev) => [fallbackUser, ...prev]);
          setCurrentUser(fallbackUser);
        }
        setActiveTab('admin-overview');
      } else {
        // No business created yet, take to console to create one
        setActiveTab('admin-overview');
      }
    } else if (role === 'CUSTOMER') {
      const b = businessId ? businesses.find((biz) => biz.id === businessId) : (currentBusiness || businesses[0] || null);
      if (b) setCurrentBusiness(b);
      const custUser = (email ? users.find((u) => u.email === email && u.role === 'CUSTOMER') : null) ||
        users.find((u) => u.role === 'CUSTOMER') || null;
      if (custUser) {
        setCurrentUser(custUser);
        setActiveTab('customer-dashboard');
      } else {
        setActiveTab('customer-plans');
      }
    }
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id' | 'registeredAt' | 'businessId'> & { businessId?: string }) => {
    const bId = customerData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${bId.slice(-4)}-${Date.now().toString().slice(-4)}`,
      businessId: bId,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, partial: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...partial } : c)));
  };

  // Product Management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'businessId'> & { businessId?: string }) => {
    const bId = productData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const newProduct: Product = {
      ...productData,
      id: `PROD-${Date.now().toString().slice(-6)}`,
      businessId: bId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, partial: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  // Plan Management
  const addPlan = (planData: Omit<SubscriptionPlan, 'id' | 'businessId'> & { businessId?: string }) => {
    const bId = planData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const newPlan: SubscriptionPlan = {
      ...planData,
      id: `PLAN-${Date.now().toString().slice(-6)}`,
      businessId: bId,
    };
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id: string, partial: Partial<SubscriptionPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  };

  // Subscription Request Operations
  const submitSubscriptionRequest = (data: {
    businessId: string;
    planId: string;
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    quantity: number;
    selectedAddOns: string[];
    payNow?: boolean;
    paymentMethod?: Payment['paymentMethod'];
    notes?: string;
  }) => {
    const targetBiz = businesses.find((b) => b.id === data.businessId);
    const targetPlan = plans.find((p) => p.id === data.planId);
    if (!targetPlan) return {};

    const baseAmount = targetPlan.price * (data.quantity || 1);
    const prod = products.find((p) => p.id === targetPlan.productId);
    const addOnTotal = (data.selectedAddOns || []).reduce((acc, aId) => {
      const found = prod?.addOns.find((a) => a.id === aId);
      return acc + (found ? found.price : 0);
    }, 0);
    const totalAmount = baseAmount + addOnTotal;

    const reqId = `REQ-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const requestedAt = now.toISOString();

    const isAutoApprove = data.payNow || targetBiz?.autoApproveSubscriptions;
    const finalCustId = data.customerId || `CUST-${data.businessId.slice(-4)}-${Date.now().toString().slice(-4)}`;

    if (isAutoApprove) {
      const subNum = `SUB-${targetBiz?.slug.slice(0, 3).toUpperCase() || 'SUB'}-${Date.now().toString().slice(-4)}`;
      const newSub: Subscription = {
        id: `SUB-${Date.now()}`,
        businessId: data.businessId,
        subscriptionNumber: subNum,
        customerId: finalCustId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        planId: targetPlan.id,
        planName: targetPlan.name,
        quantity: data.quantity,
        selectedAddOns: data.selectedAddOns,
        startDate: now.toISOString().split('T')[0],
        expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        billingFrequency: targetPlan.billingFrequency,
        amount: totalAmount,
        nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        autoRenewal: true,
        status: 'ACTIVE',
        activityTimeline: [
          {
            id: `TL-${Date.now()}`,
            timestamp: now.toLocaleString(),
            action: 'Subscription Enrolled & Activated',
            details: `Enrolled with instant activation.`,
            actor: data.customerName,
          },
        ],
      };

      const invNum = `${targetBiz?.slug.slice(0, 3).toUpperCase() || 'INV'}-2026-${1000 + invoices.length + 1}`;
      const taxRate = settings.taxRate || 18;
      const taxAmount = Number(((totalAmount * taxRate) / 100).toFixed(2));
      const grandTotal = Number((totalAmount + taxAmount).toFixed(2));

      const newInv: Invoice = {
        id: `INV-${Date.now()}`,
        businessId: data.businessId,
        invoiceNumber: invNum,
        subscriptionId: newSub.id,
        subscriptionNumber: newSub.subscriptionNumber,
        customerId: finalCustId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerAddress: 'Billing Address',
        billingPeriod: `01 ${now.toLocaleString('default', { month: 'short' })} 2026 to end of cycle`,
        periodKey: `${newSub.id}_${now.toISOString().slice(0, 7)}`,
        invoiceDate: now.toISOString().split('T')[0],
        dueDate: now.toISOString().split('T')[0],
        productLines: [
          {
            id: `IL-${Date.now()}-1`,
            description: `${targetPlan.name} (${data.quantity} Unit)`,
            quantity: data.quantity,
            unitPrice: targetPlan.price,
            total: baseAmount,
            type: 'BASE_PLAN',
          },
        ],
        basePrice: baseAmount,
        addOnsTotal: addOnTotal,
        discountAmount: 0,
        subtotal: totalAmount,
        taxRate,
        taxAmount,
        totalAmount: grandTotal,
        paidAmount: data.payNow ? grandTotal : 0,
        outstandingAmount: data.payNow ? 0 : grandTotal,
        status: data.payNow ? 'PAID' : 'CONFIRMED',
        createdAt: now.toISOString().split('T')[0],
      };

      setSubscriptions((prev) => [newSub, ...prev]);
      setInvoices((prev) => [newInv, ...prev]);

      if (data.payNow) {
        const payNum = `${targetBiz?.slug.slice(0, 3).toUpperCase() || 'PAY'}-${Date.now().toString().slice(-4)}`;
        const newPay: Payment = {
          id: `PAY-${Date.now()}`,
          businessId: data.businessId,
          paymentNumber: payNum,
          customerId: finalCustId,
          customerName: data.customerName,
          invoiceId: newInv.id,
          invoiceNumber: newInv.invoiceNumber,
          amount: grandTotal,
          paymentMethod: data.paymentMethod || 'UPI',
          paymentDate: now.toISOString().split('T')[0],
          transactionReference: `PAY/${Date.now().toString().slice(-8)}`,
          status: 'SUCCESS',
        };
        setPayments((prev) => [newPay, ...prev]);
      }

      return { subscription: newSub };
    } else {
      const newReq: SubscriptionRequest = {
        id: reqId,
        businessId: data.businessId,
        planId: targetPlan.id,
        planName: targetPlan.name,
        customerId: finalCustId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerMobile: data.customerMobile,
        quantity: data.quantity,
        billingFrequency: targetPlan.billingFrequency,
        amount: totalAmount,
        selectedAddOns: data.selectedAddOns,
        status: 'PENDING',
        requestedAt,
      };

      setSubscriptionRequests((prev) => [newReq, ...prev]);
      return { request: newReq };
    }
  };

  const approveSubscriptionRequest = (requestId: string): Subscription | null => {
    const req = subscriptionRequests.find((r) => r.id === requestId);
    if (!req) return null;

    const b = businesses.find((biz) => biz.id === req.businessId);
    const subNum = `SUB-${b?.slug.slice(0, 3).toUpperCase() || 'SUB'}-${Date.now().toString().slice(-4)}`;
    const now = new Date();

    const newSub: Subscription = {
      id: `SUB-${Date.now()}`,
      businessId: req.businessId,
      subscriptionNumber: subNum,
      customerId: req.customerId,
      customerName: req.customerName,
      customerEmail: req.customerEmail,
      planId: req.planId,
      planName: req.planName,
      quantity: req.quantity,
      selectedAddOns: req.selectedAddOns,
      startDate: now.toISOString().split('T')[0],
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingFrequency: req.billingFrequency,
      amount: req.amount,
      nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      autoRenewal: true,
      status: 'ACTIVE',
      activityTimeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: now.toLocaleString(),
          action: 'Request Approved by Business Owner',
          details: `Approved by ${b?.ownerName || 'Business Owner'}. Activated subscription and issued cycle invoice.`,
          actor: b?.ownerName || 'Business Owner',
        },
      ],
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED', approvedAt: now.toISOString() } : r))
    );

    return newSub;
  };

  const rejectSubscriptionRequest = (requestId: string, reason: string) => {
    setSubscriptionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED', rejectionReason: reason } : r))
    );
  };

  const updateBusinessStatus = (businessId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setBusinesses((prev) => prev.map((b) => (b.id === businessId ? { ...b, status } : b)));
    if (currentBusiness?.id === businessId) {
      setCurrentBusiness((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const updateBusinessDetails = (businessId: string, partial: Partial<Business>) => {
    setBusinesses((prev) => prev.map((b) => (b.id === businessId ? { ...b, ...partial } : b)));
    if (currentBusiness?.id === businessId) {
      setCurrentBusiness((prev) => (prev ? { ...prev, ...partial } : null));
    }
  };

  // Quotation Operations
  const createQuotation = (
    quoData: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt' | 'businessId'> & { businessId?: string }
  ) => {
    const bId = quoData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const qCount = quotations.filter((q) => q.businessId === bId).length;
    const prefix = settings.invoicePrefix || 'QT';
    const quoNumber = `${prefix}-QT-${2026}-${1000 + qCount + 1}`;

    const newQuo: Quotation = {
      ...quoData,
      id: `QUO-${Date.now()}`,
      businessId: bId,
      quotationNumber: quoNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setQuotations((prev) => [newQuo, ...prev]);
    return newQuo;
  };

  const updateQuotationStatus = (id: string, status: Quotation['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const convertQuotationToSubscription = (quotationId: string): Subscription | null => {
    const quo = quotations.find((q) => q.id === quotationId);
    if (!quo) return null;

    const b = businesses.find((biz) => biz.id === quo.businessId);
    const subNum = `SUB-${b?.slug.slice(0, 3).toUpperCase() || 'SUB'}-${Date.now().toString().slice(-4)}`;
    const now = new Date();

    const newSub: Subscription = {
      id: `SUB-${Date.now()}`,
      businessId: quo.businessId,
      subscriptionNumber: subNum,
      customerId: quo.customerId,
      customerName: quo.customerName,
      customerEmail: quo.customerEmail,
      planId: quo.planId,
      planName: quo.planName,
      quantity: 1,
      selectedAddOns: [],
      startDate: now.toISOString().split('T')[0],
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingFrequency: 'MONTHLY',
      amount: quo.totalAmount,
      nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      autoRenewal: true,
      status: 'CONFIRMED',
      activityTimeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: now.toLocaleString(),
          action: 'Quotation Converted',
          details: `Converted from Quotation #${quo.quotationNumber}. Confirmed state created.`,
          actor: b?.ownerName || 'Business Owner',
        },
      ],
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    updateQuotationStatus(quotationId, 'ACCEPTED');
    return newSub;
  };

  // Subscription Operations
  const createSubscription = (
    subData: Omit<Subscription, 'id' | 'subscriptionNumber' | 'activityTimeline' | 'businessId'> & { businessId?: string }
  ) => {
    const bId = subData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const subCount = subscriptions.filter((s) => s.businessId === bId).length;
    const prefix = settings.invoicePrefix || 'SUB';
    const subNum = `${prefix}-SUB-${2026}-${1000 + subCount + 1}`;

    const newSub: Subscription = {
      ...subData,
      id: `SUB-${Date.now()}`,
      businessId: bId,
      subscriptionNumber: subNum,
      activityTimeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: 'Subscription Created',
          details: `Initial setup of ${subData.planName} for ${subData.customerName}`,
          actor: currentBusiness?.ownerName || 'Business Owner',
        },
      ],
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    return newSub;
  };

  const updateSubscriptionStatus = (id: string, status: Subscription['status'], reason?: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const now = new Date().toLocaleString();
        const action = `Status changed to ${status}`;
        const details = reason ? `Reason: ${reason}` : 'Updated via Business Console';
        return {
          ...s,
          status,
          pauseReason: status === 'PAUSED' ? reason : undefined,
          cancelReason: status === 'CANCELLED' ? reason : undefined,
          activityTimeline: [
            {
              id: `TL-${Date.now()}`,
              timestamp: now,
              action,
              details,
              actor: currentBusiness?.ownerName || 'Business Owner',
            },
            ...s.activityTimeline,
          ],
        };
      })
    );
  };

  const changeSubscriptionPlan = (id: string, newPlanId: string) => {
    const newPlan = plans.find((p) => p.id === newPlanId);
    if (!newPlan) return;

    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          planId: newPlan.id,
          planName: newPlan.name,
          amount: newPlan.price * (s.quantity || 1),
          billingFrequency: newPlan.billingFrequency,
          activityTimeline: [
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              action: 'Plan Modified',
              details: `Upgraded to ${newPlan.name} at ₹${newPlan.price}/${newPlan.billingFrequency}`,
              actor: currentBusiness?.ownerName || 'Business Owner',
            },
            ...s.activityTimeline,
          ],
        };
      })
    );
  };

  const renewSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const currentExp = new Date(s.expiryDate);
        currentExp.setFullYear(currentExp.getFullYear() + 1);
        return {
          ...s,
          expiryDate: currentExp.toISOString().split('T')[0],
          status: 'ACTIVE',
          activityTimeline: [
            {
              id: `TL-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              action: 'Manual Renewal Requested',
              details: `Extended expiration date to ${currentExp.toISOString().split('T')[0]}`,
              actor: currentBusiness?.ownerName || 'Business Owner',
            },
            ...s.activityTimeline,
          ],
        };
      })
    );
  };

  // Invoice & Payment Operations
  const createInvoice = (
    invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'businessId'> & { businessId?: string }
  ) => {
    const bId = invData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const invCount = invoices.filter((i) => i.businessId === bId).length;
    const prefix = settings.invoicePrefix || 'INV';
    const invNum = `${prefix}-${2026}-${1000 + invCount + 1}`;

    const newInv: Invoice = {
      ...invData,
      id: `INV-${Date.now()}`,
      businessId: bId,
      invoiceNumber: invNum,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const recordPayment = (paymentData: {
    customerId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference: string;
    notes?: string;
  }) => {
    const inv = invoices.find((i) => i.id === paymentData.invoiceId);
    const bId = inv?.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const payCount = payments.filter((p) => p.businessId === bId).length;
    const prefix = settings.invoicePrefix || 'PAY';
    const payNum = `${prefix}-REC-${2026}-${1000 + payCount + 1}`;
    const cust = customers.find((c) => c.id === paymentData.customerId);

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      businessId: bId,
      paymentNumber: payNum,
      customerId: paymentData.customerId,
      customerName: cust?.name || inv?.customerName || 'Customer',
      invoiceId: paymentData.invoiceId,
      invoiceNumber: inv?.invoiceNumber || 'INV-000',
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionReference: paymentData.transactionReference,
      status: 'SUCCESS',
      notes: paymentData.notes,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update invoice balance
    if (inv) {
      const newPaid = Number((inv.paidAmount + paymentData.amount).toFixed(2));
      const newOutstanding = Number(Math.max(0, inv.totalAmount - newPaid).toFixed(2));
      let newStatus: Invoice['status'] = inv.status;
      if (newOutstanding === 0) newStatus = 'PAID';
      else if (newPaid > 0) newStatus = 'PARTIALLY_PAID';

      setInvoices((prev) =>
        prev.map((i) =>
          i.id === paymentData.invoiceId
            ? { ...i, paidAmount: newPaid, outstandingAmount: newOutstanding, status: newStatus }
            : i
        )
      );
    }

    return newPayment;
  };

  // Discounts & Settings
  const addDiscount = (discountData: Omit<Discount, 'id' | 'timesUsed' | 'businessId'> & { businessId?: string }) => {
    const bId = discountData.businessId || activeBusinessId || 'BIZ-DEFAULT';
    const newDiscount: Discount = {
      ...discountData,
      id: `DISC-${Date.now().toString().slice(-4)}`,
      businessId: bId,
      timesUsed: 0,
    };
    setDiscounts((prev) => [newDiscount, ...prev]);
    return newDiscount;
  };

  const updateDiscount = (id: string, partial: Partial<Discount>) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, ...partial } : d)));
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setAllBusinessSettings((prev) => ({
      ...prev,
      [activeBusinessId]: { ...settings, ...newSettings },
    }));
  };

  // Aavritti Intelligent Billing Engine
  const previewBillingEngine = (): BillingPreviewItem[] => {
    const now = new Date();
    const currentPeriodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const periodLabel = `01 ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} to 30 ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

    return tenantSubscriptions.map((sub) => {
      const cust = tenantCustomers.find((c) => c.id === sub.customerId) || {
        id: sub.customerId,
        businessId: activeBusinessId,
        name: sub.customerName,
        email: sub.customerEmail,
        mobile: '',
        address: 'Registered Address',
        registeredAt: sub.startDate,
        status: 'ACTIVE' as const,
      };

      const plan = tenantPlans.find((p) => p.id === sub.planId) || {
        id: sub.planId,
        businessId: activeBusinessId,
        productId: 'PROD-GEN',
        productName: sub.planName,
        name: sub.planName,
        description: 'Auto Plan',
        price: sub.amount,
        billingFrequency: sub.billingFrequency,
        pricingModel: 'FIXED' as const,
        minQuantity: 1,
        startDate: sub.startDate,
        autoRenewal: true,
        pausePolicy: '',
        earlyCancellationPolicy: '',
        renewalPolicy: '',
        features: [],
      };

      const periodKey = `${sub.id}_${currentPeriodMonth}`;
      const alreadyInvoiced = tenantInvoices.some(
        (inv) => inv.periodKey === periodKey || (inv.subscriptionId === sub.id && inv.periodKey?.includes(currentPeriodMonth))
      );

      const taxRate = settings.taxRate || 18;
      const taxAmount = Number(((sub.amount * taxRate) / 100).toFixed(2));
      const totalWithTax = Number((sub.amount + taxAmount).toFixed(2));

      if (alreadyInvoiced) {
        return {
          subscription: sub,
          customer: cust,
          plan,
          periodKey,
          billingPeriod: periodLabel,
          calculatedAmount: sub.amount,
          taxAmount,
          totalWithTax,
          status: 'SKIPPED_DUPLICATE',
          reason: `Duplicate Shield protected: Period ${currentPeriodMonth} already invoiced.`,
        };
      }

      if (sub.status === 'PAUSED') {
        return {
          subscription: sub,
          customer: cust,
          plan,
          periodKey,
          billingPeriod: periodLabel,
          calculatedAmount: sub.amount,
          taxAmount,
          totalWithTax,
          status: 'SKIPPED_PAUSED',
          reason: `Subscription is paused (${sub.pauseReason || 'by customer request'}).`,
        };
      }

      if (['CANCELLED', 'CLOSED', 'EXPIRED'].includes(sub.status)) {
        return {
          subscription: sub,
          customer: cust,
          plan,
          periodKey,
          billingPeriod: periodLabel,
          calculatedAmount: sub.amount,
          taxAmount,
          totalWithTax,
          status: 'FAILED_INVALID',
          reason: `Subscription status is ${sub.status}. Not eligible for recurring cycle.`,
        };
      }

      return {
        subscription: sub,
        customer: cust,
        plan,
        periodKey,
        billingPeriod: periodLabel,
        calculatedAmount: sub.amount,
        taxAmount,
        totalWithTax,
        status: 'READY',
        reason: 'Eligible for recurring cycle invoice generation.',
      };
    });
  };

  const executeBillingEngine = (subscriptionIdsToProcess?: string[]): BillingEngineRunHistory => {
    const previewItems = previewBillingEngine();
    const runId = `RUN-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const startTime = now.toISOString();

    const itemsToProcess = subscriptionIdsToProcess
      ? previewItems.filter((item) => subscriptionIdsToProcess.includes(item.subscription.id))
      : previewItems;

    const details: BillingEngineRunDetail[] = [];
    let successCount = 0;
    let duplicateSkipped = 0;
    let failedCount = 0;
    let totalBilled = 0;

    const newInvoicesList: Invoice[] = [];

    itemsToProcess.forEach((item) => {
      if (item.status === 'SKIPPED_DUPLICATE') {
        duplicateSkipped++;
        details.push({
          subscriptionId: item.subscription.id,
          subscriptionNumber: item.subscription.subscriptionNumber,
          customerName: item.customer.name,
          planName: item.plan.name,
          amount: item.totalWithTax,
          status: 'SKIPPED',
          reason: item.reason,
          periodKey: item.periodKey,
        });
      } else if (item.status === 'READY') {
        successCount++;
        totalBilled += item.totalWithTax;
        const invNum = `${settings.invoicePrefix || 'INV'}-2026-${1000 + invoices.length + newInvoicesList.length + 1}`;

        const newInv: Invoice = {
          id: `INV-${Date.now()}-${newInvoicesList.length}`,
          businessId: activeBusinessId,
          invoiceNumber: invNum,
          subscriptionId: item.subscription.id,
          subscriptionNumber: item.subscription.subscriptionNumber,
          customerId: item.customer.id,
          customerName: item.customer.name,
          customerEmail: item.customer.email,
          customerAddress: item.customer.address,
          billingPeriod: item.billingPeriod,
          periodKey: item.periodKey,
          invoiceDate: now.toISOString().split('T')[0],
          dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          productLines: [
            {
              id: `IL-${Date.now()}-1`,
              description: `${item.plan.name} (${item.subscription.quantity || 1} Unit)`,
              quantity: item.subscription.quantity || 1,
              unitPrice: item.plan.price,
              total: item.calculatedAmount,
              type: 'BASE_PLAN',
            },
          ],
          basePrice: item.calculatedAmount,
          addOnsTotal: 0,
          discountAmount: 0,
          subtotal: item.calculatedAmount,
          taxRate: settings.taxRate || 18,
          taxAmount: item.taxAmount,
          totalAmount: item.totalWithTax,
          paidAmount: 0,
          outstandingAmount: item.totalWithTax,
          status: 'CONFIRMED',
          createdAt: now.toISOString().split('T')[0],
        };

        newInvoicesList.push(newInv);

        details.push({
          subscriptionId: item.subscription.id,
          subscriptionNumber: item.subscription.subscriptionNumber,
          customerName: item.customer.name,
          planName: item.plan.name,
          amount: item.totalWithTax,
          status: 'SUCCESS',
          invoiceNumber: invNum,
          reason: 'Cycle invoice generated and locked with Duplicate Shield.',
          periodKey: item.periodKey,
        });
      } else {
        failedCount++;
        details.push({
          subscriptionId: item.subscription.id,
          subscriptionNumber: item.subscription.subscriptionNumber,
          customerName: item.customer.name,
          planName: item.plan.name,
          amount: item.totalWithTax,
          status: 'FAILED',
          reason: item.reason,
          periodKey: item.periodKey,
        });
      }
    });

    if (newInvoicesList.length > 0) {
      setInvoices((prev) => [...newInvoicesList, ...prev]);
    }

    const runHistoryItem: BillingEngineRunHistory = {
      id: runId,
      businessId: activeBusinessId,
      timestamp: now.toISOString(),
      totalEvaluated: itemsToProcess.length,
      successful: successCount,
      skipped: duplicateSkipped,
      failed: failedCount,
      totalBilledAmount: totalBilled,
      details,
    };

    setBillingHistory((prev) => [runHistoryItem, ...prev]);
    return runHistoryItem;
  };

  const retryFailedBilling = (failedDetailItems: BillingEngineRunDetail[]): BillingEngineRunHistory => {
    const subIds = failedDetailItems.map((f) => f.subscriptionId);
    return executeBillingEngine(subIds);
  };

  const resetAllData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    setBusinesses([]);
    setUsers([]);
    setCustomers([]);
    setProducts([]);
    setPlans([]);
    setSubscriptionRequests([]);
    setSubscriptions([]);
    setInvoices([]);
    setPayments([]);
    setDiscounts([]);
    setQuotations([]);
    setBillingHistory([]);
    setAllBusinessSettings({});
    setCurrentBusiness(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentBusiness,
        businesses,
        users,
        setCurrentUser,
        setCurrentBusiness,
        login,
        signupBusinessOwner,
        signupCustomerForBusiness,
        logout,
        quickSwitchRole,
        activeTab,
        setActiveTab,
        customers,
        products,
        plans,
        quotations,
        subscriptions,
        subscriptionRequests,
        invoices,
        payments,
        discounts,
        billingHistory,
        settings,
        tenantCustomers,
        tenantProducts,
        tenantPlans,
        tenantQuotations,
        tenantSubscriptions,
        tenantSubscriptionRequests,
        tenantInvoices,
        tenantPayments,
        tenantDiscounts,
        tenantBillingHistory,
        signupCustomer,
        addCustomer,
        updateCustomer,
        addProduct,
        updateProduct,
        addPlan,
        updatePlan,
        submitSubscriptionRequest,
        approveSubscriptionRequest,
        rejectSubscriptionRequest,
        updateBusinessStatus,
        updateBusinessDetails,
        createQuotation,
        updateQuotationStatus,
        convertQuotationToSubscription,
        createSubscription,
        updateSubscriptionStatus,
        changeSubscriptionPlan,
        renewSubscription,
        createInvoice,
        updateInvoiceStatus,
        recordPayment,
        addDiscount,
        updateDiscount,
        updateSettings,
        previewBillingEngine,
        executeBillingEngine,
        retryFailedBilling,
        authModalOpen,
        setAuthModalOpen,
        authModalBusinessId,
        setAuthModalBusinessId,
        explainBillInvoice,
        setExplainBillInvoice,
        pdfInvoice,
        setPdfInvoice,
        pdfQuotation,
        setPdfQuotation,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
