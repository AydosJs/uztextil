import { isMobileDevice } from './deviceUtils';
import {
    viewport,
} from '@telegram-apps/sdk-react';
import { isTelegramEnvironment } from './environmentUtils';
import { TELEGRAM_SDK_CONFIG } from '@/lib/config';

/**
 * Checks if the Telegram SDK is ready and safe area functions are available
 */
export function isSDKReady(): boolean {
    // If Telegram SDK is disabled via config, SDK is not ready
    if (!TELEGRAM_SDK_CONFIG.USE_TELEGRAM_SDK) {
        return false;
    }

    // If not in Telegram environment, SDK is not ready
    if (!isTelegramEnvironment()) {
        return false;
    }

    try {
        return viewport &&
            typeof viewport.safeAreaInsetTop === 'function' &&
            typeof viewport.safeAreaInsetBottom === 'function' &&
            viewport.isMounted?.() === true;
    } catch {
        return false;
    }
}

/**
 * Waits for the SDK to be ready and returns safe area values
 * If safe area is 0px, uses default 40px for top
 */
export function waitForSafeAreaValues(): Promise<{ top: number, bottom: number }> {
    return new Promise((resolve) => {
        // If not in Telegram environment, return web-safe defaults immediately
        if (!isTelegramEnvironment()) {
            resolve({ top: 16, bottom: 8 }); // Web browser defaults
            return;
        }

        const checkSDK = () => {
            if (isSDKReady()) {
                try {
                    const top = viewport.safeAreaInsetTop();
                    const bottom = viewport.safeAreaInsetBottom();

                    // Ensure we have valid values
                    if (top >= 0 && bottom >= 0) {
                        resolve({
                            top: top > 0 ? top : 0,
                            bottom: bottom > 0 ? bottom : 0
                        });
                    } else {
                        // If values are invalid, wait a bit more
                        setTimeout(checkSDK, 50);
                    }
                } catch {
                    // If there's an error, wait a bit more
                    setTimeout(checkSDK, 50);
                }
            } else {
                setTimeout(checkSDK, 50); // Check again in 50ms
            }
        };
        checkSDK();
    });
}

/**
 * Sets CSS custom properties for safe area insets and creates Tailwind-compatible utilities
 */
export function setSafeAreaCSSProperties(): void {
    if (typeof document === 'undefined') return;

    try {
        let topValue = 16; // Web browser default
        let bottomValue = 8; // Web browser default

        // If in Telegram environment and SDK is ready, get actual values
        if (isTelegramEnvironment() && isSDKReady()) {
            const safeAreaInsetTop = viewport.safeAreaInsetTop();
            const safeAreaInsetBottom = viewport.safeAreaInsetBottom();

            // Validate values
            if (safeAreaInsetTop >= 0 && safeAreaInsetBottom >= 0) {
                topValue = safeAreaInsetTop > 0 ? safeAreaInsetTop : 0;
                bottomValue = safeAreaInsetBottom > 0 ? safeAreaInsetBottom : 0;
            }
        }

        const isMobile = isMobileDevice();
        const finalTopValue = topValue + (isMobile ? 48 : 16);

        let styleEl = document.getElementById("safe-area-styles");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "safe-area-styles";
            document.head.appendChild(styleEl);
        }

        // Create CSS custom properties for Tailwind to use
        styleEl.innerHTML = `
            :root {
                --safe-area-top: ${finalTopValue}px;
                --safe-area-bottom: ${bottomValue}px;
            }
            
            /* Safe area utility classes that work with Tailwind */
            .safe-area-pt {
                padding-top: var(--safe-area-top) !important;
            }
            
            .safe-area-pb {
                padding-bottom: max(var(--safe-area-bottom), 8px) !important;
            }
            
            .safe-area-py {
                padding-top: var(--safe-area-top) !important;
                padding-bottom: var(--safe-area-bottom) !important;
            }
            
            .safe-area-mt {
                margin-top: var(--safe-area-top) !important;
            }
            
            .safe-area-mb {
                margin-bottom: var(--safe-area-bottom) !important;
            }
            
            .safe-area-my {
                margin-top: var(--safe-area-top) !important;
                margin-bottom: var(--safe-area-bottom) !important;
            }
        `;
    } catch {
        // Silent fail
    }
}

/**
 * Gets current safe area values (only top and bottom)
 * If safe area doesn't exist, uses 0px as default
 */
export function getSafeAreaValues() {
    try {
        if (!isTelegramEnvironment() || !isSDKReady()) {
            return { top: 16, bottom: 8 }; // Web browser defaults
        }
        const top = viewport.safeAreaInsetTop();
        const bottom = viewport.safeAreaInsetBottom();
        return {
            top: top > 0 ? top : 0,
            bottom: bottom > 0 ? bottom : 0,
        };
    } catch {
        return { top: 16, bottom: 8 }; // Web browser defaults
    }
}

/**
 * Creates Tailwind CSS classes with arbitrary values for safe areas (only top and bottom)
 * Usage: className={getSafeAreaClass('pt')} // becomes pt-[47px] or pt-[0px] based on actual safe area
 */
export function getSafeAreaClass(property: 'pt' | 'pb' | 'py'): string {
    try {
        if (!isTelegramEnvironment() || !isSDKReady()) {
            // Return web browser defaults
            return property === 'pt' ? 'pt-[16px]' : property === 'pb' ? 'pb-[8px]' : 'pt-[16px] pb-[8px]';
        }

        if (property === 'py') {
            const topValue = viewport.safeAreaInsetTop();
            const bottomValue = viewport.safeAreaInsetBottom();
            return `pt-[${topValue > 0 ? topValue : 0}px] pb-[${bottomValue > 0 ? bottomValue : 0}px]`;
        }

        if (property === 'pt') {
            const topValue = viewport.safeAreaInsetTop();
            return `pt-[${topValue > 0 ? topValue : 0}px]`;
        }

        if (property === 'pb') {
            const bottomValue = viewport.safeAreaInsetBottom();
            return `pb-[${bottomValue > 0 ? bottomValue : 0}px]`;
        }

        return '';
    } catch {
        // Return web browser defaults on error
        return property === 'pt' ? 'pt-[16px]' : property === 'pb' ? 'pb-[8px]' : 'pt-[16px] pb-[8px]';
    }
}
