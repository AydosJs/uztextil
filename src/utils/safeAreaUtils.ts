import {
    viewportSafeAreaInsetTop,
    viewportSafeAreaInsetBottom,
} from '@telegram-apps/sdk';

/**
 * Sets CSS custom properties for safe area insets using dynamic style injection
 */
export function setSafeAreaCSSProperties(): void {
    if (typeof document === 'undefined') return;

    const safeAreaInsetTop = viewportSafeAreaInsetTop();
    const safeAreaInsetBottom = viewportSafeAreaInsetBottom();

    let styleEl = document.getElementById("dynamic-vars");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "dynamic-vars";
        document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
        :root, :root * {
            --safe-area-inset-top: ${safeAreaInsetTop > 0 ? `${safeAreaInsetTop + 48}px` : "0px"
        } !important;
            --safe-area-inset-bottom: ${safeAreaInsetBottom > 0 ? `${safeAreaInsetBottom}px` : "0px"
        } !important;
        }
    `;
}

/**
 * Gets current safe area values (only top and bottom)
 */
export function getSafeAreaValues() {
    return {
        top: viewportSafeAreaInsetTop(),
        bottom: viewportSafeAreaInsetBottom(),
    };
}

/**
 * Creates Tailwind CSS classes with arbitrary values for safe areas (only top and bottom)
 * Usage: className={getSafeAreaClass('pt')} // becomes pt-[47px] or pt-[0px] based on actual safe area
 */
export function getSafeAreaClass(property: 'pt' | 'pb' | 'py'): string {
    if (property === 'py') {
        const topValue = viewportSafeAreaInsetTop();
        const bottomValue = viewportSafeAreaInsetBottom();
        return `pt-[${topValue}px] pb-[${bottomValue}px]`;
    }

    if (property === 'pt') {
        const topValue = viewportSafeAreaInsetTop();
        return `pt-[${topValue}px]`;
    }

    if (property === 'pb') {
        const bottomValue = viewportSafeAreaInsetBottom();
        return `pb-[${bottomValue}px]`;
    }

    return '';
}
