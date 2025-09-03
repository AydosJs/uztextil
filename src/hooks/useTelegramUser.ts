import { useContext } from 'react';
import { TelegramUserContext } from '@/contexts/TelegramUserContextInstance';
import type { TelegramUserContextType } from '@/types/telegramContext';

export function useTelegramUser(): TelegramUserContextType {
    const context = useContext(TelegramUserContext);
    if (context === undefined) {
        throw new Error('useTelegramUser must be used within a TelegramUserProvider');
    }
    return context;
}
