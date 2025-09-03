import { createContext } from 'react';
import type { TelegramUserContextType } from '@/types/telegramContext';

export const TelegramUserContext = createContext<TelegramUserContextType | undefined>(undefined);
