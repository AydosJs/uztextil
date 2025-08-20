import {
    backButton,
    init,
    initData,
    miniApp,
    swipeBehavior,
    postEvent,
    viewport,
} from "@telegram-apps/sdk-react";
import { setSafeAreaCSSProperties } from './safeAreaUtils';

/**
 * Initializes the application and configures its dependencies.
 */
export async function initSDK(): Promise<string> {
    // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
    // Also, configure the package.
    init();

    // Check if all required components are supported.
    if (!backButton.isSupported() || !miniApp.isSupported()) {
        return Promise.reject("error");
    }

    postEvent("web_app_set_background_color", {
        color: "#101017",
    });

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setTimeout(async () => {
        if (viewport.mount.isAvailable() && isMobile) {
            await viewport.mount();
            viewport.expand(); // first it would be better to expand
        }
        if (viewport.requestFullscreen.isAvailable() && isMobile) {
            await viewport.requestFullscreen(); // then request full screen mode
        }

        // Set safe area CSS properties after viewport is ready
        setSafeAreaCSSProperties();
    }, 0);

    if (swipeBehavior.mount.isAvailable()) {
        swipeBehavior.mount();
    }
    if (swipeBehavior.disableVertical.isAvailable()) {
        swipeBehavior.disableVertical();
        swipeBehavior.isVerticalEnabled(); // false
    }

    // Mount all components used in the project.
    backButton.mount();
    await miniApp.mount();
    initData.restore();

    return "done";
}
