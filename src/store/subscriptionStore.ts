import { create } from 'zustand';
import { SubscriptionStatus } from '../components/my-subscription/SubscriptionStatus';

 

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
    [SubscriptionStatus.ACTIVE]: 'Activa',
    [SubscriptionStatus.PAUSED]: 'Pausada',
    [SubscriptionStatus.PAUSED_INVOLUNTARY]: 'Pausada (involuntaria)',
    [SubscriptionStatus.RETRYING]: 'Reintentando',
};

interface SubscriptionState {
    status: SubscriptionStatus;
    setStatus: (status: SubscriptionStatus) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    status: SubscriptionStatus.ACTIVE,
    setStatus: (status) => set({ status }),
}));
