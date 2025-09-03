import type { TelegramUser, TelegramUserInfo } from './telegram';
import type { ReactNode } from 'react';

export interface TelegramUserContextType {
    user: TelegramUser | null;
    userInfo: TelegramUserInfo | null;
    isLoading: boolean;
    isRegistered: boolean;
    userType: 'manufacturer' | 'customer' | null;
    registerUser: () => Promise<void>;
    fetchUserInfo: () => Promise<void>;
    clearUser: () => void;
}

export interface TelegramUserProviderProps {
    children: ReactNode;
}
