import {
    backButton,
    init,
    initData,
    miniApp,
    swipeBehavior,
    viewport,
} from "@telegram-apps/sdk-react";


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

    // Wait for viewport to be ready and mount it
    try {
        await viewport.mount();
        console.log('Viewport mounted successfully');

        // Wait a bit for viewport to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            viewport.expand(); // first it would be better to expand
            console.log('Viewport expanded');
        } catch {
            // Viewport expand not available
        }

        // Wait for viewport to settle after expansion
        await new Promise(resolve => setTimeout(resolve, 200));

        // Only request fullscreen on mobile devices, not on desktop
        // const isDesktop = window.innerWidth > 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false;

        // if (!isDesktop) {
        try {
            await viewport.requestFullscreen(); // then request full screen mode
            console.log('Fullscreen requested');
        } catch {
            // Fullscreen not available
        }
        // } else {
        //     console.log('Desktop detected, skipping fullscreen request');
        // }

        // Wait for fullscreen to be applied
        await new Promise(resolve => setTimeout(resolve, 300));
    } catch {
        // Viewport mount not available
    }

    // Mount all components used in the project.
    try {
        backButton.mount();
        console.log('Back button mounted');
    } catch {
        // Back button mount not available
    }

    try {
        await miniApp.mount();
        console.log('Mini app mounted');
    } catch {
        // Mini app mount not available
    }

    try {
        initData.restore();
        console.log('Init data restored');
    } catch {
        // Init data restore not available
    }

    try {
        swipeBehavior.mount();
        console.log('Swipe behavior mounted');
    } catch {
        // Swipe behavior mount not available
    }

    try {
        swipeBehavior.disableVertical();
        console.log('Vertical swipe disabled');
    } catch {
        // Vertical swipe disable not available
    }

    // Wait a bit more for everything to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    return "done";
}
