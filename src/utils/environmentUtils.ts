/**
 * Environment detection utilities
 * Determines if the app is running in Telegram Mini App or regular web browser
 */
import { TELEGRAM_SDK_CONFIG } from '@/lib/config';

/**
 * Checks if the app is running inside Telegram Mini App
 * @returns true if running in Telegram, false if in regular web browser
 */
export function isTelegramEnvironment(): boolean {
    // If SDK usage is disabled via config, always return false (web mode)
    if (!TELEGRAM_SDK_CONFIG.USE_TELEGRAM_SDK) {
        return false;
    }

    if (typeof window === 'undefined') return false;

    // Check for Telegram WebApp object
    return !!(window as any).Telegram?.WebApp;
}

/**
 * Checks if the app is running in a regular web browser
 * @returns true if running in web browser, false if in Telegram
 */
export function isWebBrowserEnvironment(): boolean {
    return !isTelegramEnvironment();
}

/**
 * Gets the current environment type
 * @returns 'telegram' | 'web'
 */
export function getEnvironment(): 'telegram' | 'web' {
    return isTelegramEnvironment() ? 'telegram' : 'web';
}

/**
 * Checks if we should use mock data
 * @returns true if mock data should be used (web browser or development mode)
 */
export function shouldUseMockData(): boolean {
    return isWebBrowserEnvironment() || import.meta.env.DEV;
}

