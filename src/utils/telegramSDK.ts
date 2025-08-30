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

    // Wait for viewport to be ready and mount it
    if (viewport.mount.isAvailable() && isMobile) {
        await viewport.mount();
        console.log('Viewport mounted successfully');

        // Wait a bit for viewport to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (viewport.expand.isAvailable()) {
            viewport.expand(); // first it would be better to expand
            console.log('Viewport expanded');
        }

        // Wait for viewport to settle after expansion
        await new Promise(resolve => setTimeout(resolve, 200));

        if (viewport.requestFullscreen.isAvailable() && isMobile) {
            await viewport.requestFullscreen(); // then request full screen mode
            console.log('Fullscreen requested');
        }

        // Wait for fullscreen to be applied
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Mount all components used in the project.
    if (backButton.mount.isAvailable()) {
        backButton.mount();
        console.log('Back button mounted');
    }

    if (miniApp.mount.isAvailable()) {
        await miniApp.mount();
        console.log('Mini app mounted');
    }

    if (initData.restore.isAvailable()) {
        initData.restore();
        console.log('Init data restored');
    }

    if (swipeBehavior.mount.isAvailable()) {
        swipeBehavior.mount();
        console.log('Swipe behavior mounted');
    }

    if (swipeBehavior.disableVertical.isAvailable()) {
        swipeBehavior.disableVertical();
        console.log('Vertical swipe disabled');
    }

    // Wait a bit more for everything to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    return "done";
}
