// Culto API Service
// Based on the existing Shopify theme implementation

export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_PAUSED = 'PAUSED';
export const STATUS_RETRYING = 'RETRYING';
export const STATUS_PAUSED_INVOLUNTARY = 'PAUSED_INVOLUNTARY';

export type SubscriptionStatus = 
  | typeof STATUS_ACTIVE 
  | typeof STATUS_PAUSED 
  | typeof STATUS_RETRYING 
  | typeof STATUS_PAUSED_INVOLUNTARY;

export interface CultoPrice {
  id: string;
  shopify_product_id: string;
  bag_amount: number;
  description: string;
}

export interface CultoAddress {
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export interface CultoCoupon {
  flow_type?: string[];
}

export interface CultoSubscription {
  id: string;
  status: SubscriptionStatus;
  grinding_type: string;
  next_charge_date: string;
  delivery_method: 'SHIPPING' | 'PICKUP';
  pickup_location?: string;
  address?: CultoAddress;
  metadata?: string;
  coupon?: CultoCoupon;
  price: {
    id: string;
    shopify_product_id: string;
    bag_amount: number;
    description: string;
  };
}

export interface DashboardLabels {
  title: string;
  description: string;
  descriptionAlt: string;
  bannerClass: string;
}

export const DASHBOARD_LABELS: Record<SubscriptionStatus, DashboardLabels> = {
  [STATUS_ACTIVE]: {
    title: "TU SUSCRIPCIÓN ESTÁ ACTIVA",
    description: "Podés modificar tu plan, cambiar la fecha de entrega o cancelarla cuando quieras.",
    descriptionAlt: "",
    bannerClass: "dashboard-card-active"
  },
  [STATUS_RETRYING]: {
    title: "TU SUSCRIPCIÓN ESTÁ ACTIVA",
    description: "Podés modificar tu plan, cambiar la fecha de entrega o cancelarla cuando quieras.",
    descriptionAlt: "",
    bannerClass: "dashboard-card-active"
  },
  [STATUS_PAUSED]: {
    title: "TU SUSCRIPCIÓN ESTÁ CANCELADA",
    description: "Para volver, elegí un nuevo plan o reactivá el último que tenías.",
    descriptionAlt: "",
    bannerClass: "dashboard-card-cancel"
  },
  [STATUS_PAUSED_INVOLUNTARY]: {
    title: "TU SUSCRIPCIÓN ESTÁ PAUSADA",
    description: "No pudimos cobrar tu último ciclo porque tu método de pago venció.",
    descriptionAlt: "Para volver a recibir tu café, actualizá tu método de pago.",
    bannerClass: "dashboard-card-paused"
  }
};

// Cancellation reasons mapping
export const CANCELLATION_REASONS: Record<string, string> = {
  'Tengo café acumulado en casa': 'ACUMULATION',
  'Estoy recortando gastos': 'ECONOMIC',
  'No me están gustando los cafés que recibo': 'DO_NOT_LIKE_COFFEE',
  'Voy a viajar (de vacaciones o al exterior)': 'VACATIONS',
  'Tuve problemas con las entregas': 'LOGISTICS',
  'No quedé satisfecho(a) con la atención recibida': 'BAD_SERVICE',
  'No tomo café en verano': 'NO_COFFEE_ON_SUMMER',
  'Viaje': 'TRAVEL'
};

// API Base URL - should be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_CULTO_API_URL || 'https://api.culto.coffee';

// Cookie utilities
export const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Get authentication token
export const getToken = async (): Promise<string> => {
  // This should be implemented based on your auth flow
  // For now, return from cookie or fetch new token
  const existingToken = getCookie('apiLogin');
  if (existingToken) {
    return existingToken;
  }
  
  // TODO: Implement actual token fetch
  throw new Error('No auth token available');
};

// Get current subscription
export const getCurrentSubscription = (subscriptions: CultoSubscription[]): CultoSubscription | null => {
  const activeSubs = subscriptions.filter((sub) => {
    return sub.status === STATUS_ACTIVE || sub.status === STATUS_RETRYING;
  });

  const pausedSubs = subscriptions.filter((sub) => {
    return sub.status === STATUS_PAUSED || sub.status === STATUS_PAUSED_INVOLUNTARY;
  });

  let currentSub = activeSubs.length ? activeSubs[activeSubs.length - 1] : null;
    
  if (!currentSub) {
    currentSub = pausedSubs.length ? pausedSubs[pausedSubs.length - 1] : null;
  }
  
  return currentSub;
};

// Fetch subscriptions from Culto API
export const getCultoSubscriptions = async (token: string, email: string): Promise<CultoSubscription[]> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions?email=${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  const data = await response.json();
  return data.data || [];
};

// Fetch subscription prices
export const getCultoSubscriptionPrices = async (token: string): Promise<CultoPrice[]> => {
  const response = await fetch(`${API_BASE_URL}/prices`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }

  const data = await response.json();
  return data.data || [];
};

// Update subscription
export interface UpdateSubscriptionData {
  price_id?: string;
  shopify_variant_id?: string;
  status?: SubscriptionStatus;
  grinding_type?: string;
  cancellation_reason?: string;
  delivery_method?: 'SHIPPING' | 'PICKUP';
  pickup_location?: string | null;
  address?: CultoAddress;
}

export const updateCultoSubscription = async (
  token: string,
  subscriptionId: string,
  data: UpdateSubscriptionData
): Promise<CultoSubscription> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update subscription');
  }

  return response.json();
};

// Apply coupon (retention/reactivation)
export const applyCoupon = async (
  token: string,
  email: string,
  flowType: 'RETENTION' | 'REACTIVATION'
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, flow_type: flowType }),
  });

  if (!response.ok) {
    throw new Error('Failed to apply coupon');
  }
};

// Check if subscription has applied flow coupon
export const hasAppliedFlowCoupon = (subscription: CultoSubscription): boolean => {
  return !!(
    subscription.coupon && 
    (subscription.coupon.flow_type?.includes('RETENTION') || 
     subscription.coupon.flow_type?.includes('REACTIVATION'))
  );
};

// Get plan name from subscription
export const getPlanName = (subscription: CultoSubscription): string => {
  const regex = /\bPlan\s+\w+/;
  const planName = subscription.price.description.match(regex);
  return planName ? planName[0] : 'Plan';
};

// Format grinding type for API
export const getAPIGrindingType = (grindingType: string): string => {
  const grindingTypesMap: Record<string, string> = {
    "GRAOS": "EN_GRANO"
  };

  const withoutAccents = grindingType
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const upperCase = withoutAccents.toUpperCase();
  const noWhitespace = upperCase.replace(/\s+/g, "_");
  const replacedSlashes = noWhitespace.replace(/\//g, "_");
  const formattedText = replacedSlashes.replace(/_{2,}/g, "_");
  
  return grindingTypesMap[formattedText] || formattedText;
};

// Check if subscription is from Itau (special handling)
export const isItauSubscription = (subscription: CultoSubscription): boolean => {
  try {
    const rawMetadata = subscription.metadata;
    if (!rawMetadata) return false;
    
    const metadata = typeof rawMetadata === "string" 
      ? JSON.parse(rawMetadata) 
      : rawMetadata;
    
    return metadata?.itau_year === true;
  } catch {
    return false;
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });
};

