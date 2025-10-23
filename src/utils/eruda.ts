// Eruda mobile debugging utility
// Only loads in development mode

declare global {
    interface Window {
        eruda?: {
            init: () => void;
            show: () => void;
            hide: () => void;
            destroy: () => void;
        };
    }
}

export const initEruda = async (): Promise<void> => {
    // Only load Eruda in development mode
    // if (import.meta.env.DEV) {
    try {
        // Dynamic import to avoid including Eruda in production bundle
        const eruda = await import('eruda');

        // Initialize Eruda
        eruda.default.init();

        // Optional: Auto-show Eruda on mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            // You can uncomment this line to auto-show Eruda on mobile
            // eruda.default.show();
        }

        // Add keyboard shortcut (Ctrl/Cmd + Shift + E) to toggle Eruda
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
                event.preventDefault();
                toggleEruda();
            }
        });

        console.log('🔧 Eruda initialized for mobile debugging');
        console.log('💡 Press Ctrl/Cmd + Shift + E to toggle Eruda console');
    } catch (error) {
        console.warn('Failed to initialize Eruda:', error);
    }
    // }
};

// Utility function to toggle Eruda visibility
export const toggleEruda = (): void => {
    if (window.eruda) {
        // Check if Eruda is currently visible
        const erudaEl = document.querySelector('.eruda-dev-tools') as HTMLElement;
        if (erudaEl && erudaEl.style.display !== 'none') {
            window.eruda.hide();
        } else {
            window.eruda.show();
        }
    }
};

// Utility function to destroy Eruda
export const destroyEruda = (): void => {
    if (window.eruda) {
        window.eruda.destroy();
    }
};
