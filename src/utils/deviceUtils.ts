/**
 * Detects if the current device is mobile
 * This is a pure function that can be used outside of React components
 */
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false

    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

    // Check screen width
    const isSmallScreen = window.innerWidth < 768

    // Check for touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return isMobileUserAgent || (isSmallScreen && isTouchDevice)
}
