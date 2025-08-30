import {
    viewport,
} from '@telegram-apps/sdk-react';

/**
 * Checks if the Telegram SDK is ready and safe area functions are available
 */
export function isSDKReady(): boolean {
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
        const checkSDK = () => {
            if (isSDKReady()) {
                try {
                    const top = viewport.safeAreaInsetTop();
                    const bottom = viewport.safeAreaInsetBottom();

                    // Ensure we have valid values
                    if (top >= 0 && bottom >= 0) {
                        resolve({
                            top: top > 0 ? top : 40,
                            bottom: bottom
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
 * Sets CSS custom properties for safe area insets using dynamic style injection
 */
export function setSafeAreaCSSProperties(): void {
    if (typeof document === 'undefined') return;

    try {
        if (!isSDKReady()) {
            console.warn('SDK not ready, cannot set safe area properties');
            return;
        }

        const safeAreaInsetTop = viewport.safeAreaInsetTop();
        const safeAreaInsetBottom = viewport.safeAreaInsetBottom();

        // Validate values
        if (safeAreaInsetTop < 0 || safeAreaInsetBottom < 0) {
            console.warn('Invalid safe area values:', { safeAreaInsetTop, safeAreaInsetBottom });
            return;
        }

        let styleEl = document.getElementById("dynamic-vars");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "dynamic-vars";
            document.head.appendChild(styleEl);
        }

        const topValue = safeAreaInsetTop > 0 ? `${safeAreaInsetTop + 48}px` : "40px";
        const bottomValue = safeAreaInsetBottom > 0 ? `${safeAreaInsetBottom}px` : "0px";

        styleEl.innerHTML = `
            :root, :root * {
                --safe-area-inset-top: ${topValue} !important;
                --safe-area-inset-bottom: ${bottomValue} !important;
            }
        `;

        console.log('Safe area CSS properties set:', { top: topValue, bottom: bottomValue });
    } catch (error) {
        console.warn('Failed to set safe area CSS properties:', error);
    }
}

/**
 * Gets current safe area values (only top and bottom)
 * If safe area is 0px, uses default 40px for top
 */
export function getSafeAreaValues() {
    try {
        if (!isSDKReady()) {
            return { top: 40, bottom: 0 };
        }
        const top = viewport.safeAreaInsetTop();
        const bottom = viewport.safeAreaInsetBottom();
        return {
            top: top > 0 ? top : 40,
            bottom: bottom,
        };
    } catch {
        return { top: 40, bottom: 0 };
    }
}

/**
 * Creates Tailwind CSS classes with arbitrary values for safe areas (only top and bottom)
 * Usage: className={getSafeAreaClass('pt')} // becomes pt-[47px] or pt-[0px] based on actual safe area
 */
export function getSafeAreaClass(property: 'pt' | 'pb' | 'py'): string {
    try {
        if (!isSDKReady()) {
            return property === 'pt' ? 'pt-[40px]' : property === 'pb' ? 'pb-[0px]' : 'pt-[40px] pb-[0px]';
        }

        if (property === 'py') {
            const topValue = viewport.safeAreaInsetTop();
            const bottomValue = viewport.safeAreaInsetBottom();
            return `pt-[${topValue > 0 ? topValue : 40}px] pb-[${bottomValue}px]`;
        }

        if (property === 'pt') {
            const topValue = viewport.safeAreaInsetTop();
            return `pt-[${topValue > 0 ? topValue : 40}px]`;
        }

        if (property === 'pb') {
            const bottomValue = viewport.safeAreaInsetBottom();
            return `pb-[${bottomValue}px]`;
        }

        return '';
    } catch {
        return property === 'pt' ? 'pt-[40px]' : property === 'pb' ? 'pb-[0px]' : 'pt-[40px] pb-[0px]';
    }
}
