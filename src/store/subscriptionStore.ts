import { create } from 'zustand';
import {
  CultoSubscription,
  CultoPrice,
  SubscriptionStatus,
  STATUS_ACTIVE,
  STATUS_PAUSED,
  STATUS_RETRYING,
  STATUS_PAUSED_INVOLUNTARY,
  getCultoSubscriptions,
  getCultoSubscriptionPrices,
  updateCultoSubscription,
  getCurrentSubscription,
  applyCoupon,
  UpdateSubscriptionData,
  getCookie,
  setCookie,
} from '../services/cultoApi';

// Re-export SubscriptionStatus for components that import from here
export { SubscriptionStatus } from '../components/my-subscription/SubscriptionStatus';

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [STATUS_ACTIVE]: 'Activa',
  [STATUS_PAUSED]: 'Cancelada',
  [STATUS_PAUSED_INVOLUNTARY]: 'Pausada (involuntaria)',
  [STATUS_RETRYING]: 'Reintentando',
};

interface SubscriptionState {
  // Auth
  token: string | null;
  customerEmail: string | null;
  customerId: string | null;
  
  // Data
  subscription: CultoSubscription | null;
  allSubscriptions: CultoSubscription[];
  prices: CultoPrice[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setToken: (token: string) => void;
  setCustomerEmail: (email: string) => void;
  setCustomerId: (id: string) => void;
  
  // API Actions
  loadSubscriptionData: () => Promise<void>;
  loadPrices: () => Promise<void>;
  updateSubscription: (data: UpdateSubscriptionData) => Promise<void>;
  cancelSubscription: (reason: string) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  applyRetentionCoupon: () => Promise<void>;
  applyReactivationCoupon: () => Promise<void>;
  
  // Legacy compatibility
  status: SubscriptionStatus;
  setStatus: (status: SubscriptionStatus) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  token: null,
  customerEmail: null,
  customerId: null,
  subscription: null,
  allSubscriptions: [],
  prices: [],
  isLoading: false,
  error: null,
  status: STATUS_ACTIVE,

  // Basic setters
  setToken: (token) => {
    setCookie('apiLogin', token, 1);
    set({ token });
  },
  
  setCustomerEmail: (email) => set({ customerEmail: email }),
  setCustomerId: (id) => set({ customerId: id }),
  
  // Legacy compatibility
  setStatus: (status) => set({ status }),

  // Load subscription data from API
  loadSubscriptionData: async () => {
    const { token, customerEmail } = get();
    
    if (!token || !customerEmail) {
      set({ error: 'Missing authentication data' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const subscriptions = await getCultoSubscriptions(token, customerEmail);
      const currentSub = getCurrentSubscription(subscriptions);
      
      set({
        allSubscriptions: subscriptions,
        subscription: currentSub,
        status: currentSub?.status || STATUS_PAUSED,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load subscription',
        isLoading: false,
      });
    }
  },

  // Load prices
  loadPrices: async () => {
    const { token } = get();
    
    if (!token) {
      return;
    }

    try {
      const prices = await getCultoSubscriptionPrices(token);
      set({ prices });
    } catch (error) {
      console.error('Failed to load prices:', error);
    }
  },

  // Update subscription
  updateSubscription: async (data) => {
    const { token, subscription } = get();
    
    if (!token || !subscription) {
      set({ error: 'No subscription to update' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const updatedSub = await updateCultoSubscription(token, subscription.id, data);
      set({
        subscription: updatedSub,
        status: updatedSub.status,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (reason) => {
    const { updateSubscription } = get();
    await updateSubscription({
      status: STATUS_PAUSED,
      cancellation_reason: reason,
    });
  },

  // Reactivate subscription
  reactivateSubscription: async () => {
    const { updateSubscription } = get();
    await updateSubscription({
      status: STATUS_ACTIVE,
    });
  },

  // Apply retention coupon
  applyRetentionCoupon: async () => {
    const { token, customerEmail } = get();
    
    if (!token || !customerEmail) {
      return;
    }

    try {
      await applyCoupon(token, customerEmail, 'RETENTION');
      // Reload subscription to get updated data
      await get().loadSubscriptionData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to apply coupon',
      });
      throw error;
    }
  },

  // Apply reactivation coupon
  applyReactivationCoupon: async () => {
    const { token, customerEmail } = get();
    
    if (!token || !customerEmail) {
      return;
    }

    try {
      await applyCoupon(token, customerEmail, 'REACTIVATION');
      // Reload subscription to get updated data
      await get().loadSubscriptionData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to apply coupon',
      });
      throw error;
    }
  },
}));

// Initialize store from cookies if available
if (typeof window !== 'undefined') {
  const token = getCookie('apiLogin');
  if (token) {
    useSubscriptionStore.getState().setToken(token);
  }
}
