import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { backButton } from "@telegram-apps/sdk"

// Global state to track if back button is currently visible
let isBackButtonVisible = false
let currentClickHandler: (() => void) | null = null
let hideTimeout: NodeJS.Timeout | null = null

interface UseTelegramBackButtonOptions {
    /** Whether to show the back button when component mounts (default: true) */
    showOnMount?: boolean
    /** Whether to hide the back button when component unmounts (default: true) */
    hideOnUnmount?: boolean
    /** Path to navigate to when back button is pressed. If not provided, uses navigate(-1) */
    navigateTo?: string
    /** Custom click handler (overrides default behavior) */
    onBack?: () => void
}

/**
 * Custom hook for managing Telegram Mini App back button functionality
 * Logic: 
 * - If navigateTo provided → shows back button that navigates to specific path
 * - If no navigateTo provided → hides the back button
 * 
 * @example
 * // Back button that goes to specific page
 * useTelegramBackButton({ navigateTo: '/welcome' })
 * 
 * @example
 * // Hide the back button
 * useTelegramBackButton()
 * 
 * @example
 * // Custom click handler
 * useTelegramBackButton({
 *   onBack: () => {
 *     // Custom logic here
 *     navigate('/somewhere')
 *   }
 * })
 */
export const useTelegramBackButton = (options: UseTelegramBackButtonOptions = {}) => {
    const navigate = useNavigate()
    const {
        showOnMount = true,
        hideOnUnmount = true,
        navigateTo,
        onBack
    } = options

    // Only show button if we have a navigation target or custom handler
    const shouldShowOnMount = showOnMount && (navigateTo || onBack)

    // Use ref to track if this component is responsible for the back button
    const isOwner = useRef(false)

    useEffect(() => {
        // Determine the button behavior
        const getButtonBehavior = () => {
            if (onBack) {
                return onBack
            }

            if (navigateTo) {
                // Back button behavior - navigate to specified path
                return () => navigate(navigateTo)
            }

            // Default behavior: navigate back one step
            return () => navigate(-1)
        }

        // Cancel any pending hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }

        // Show the back button if we need it and it's not already visible
        if (shouldShowOnMount && !isBackButtonVisible && backButton.show.isAvailable()) {
            backButton.show()
            isBackButtonVisible = true
            isOwner.current = true
        }

        // Hide the back button if we don't have a navigation target and it's currently visible
        if (!shouldShowOnMount && isBackButtonVisible && backButton.hide.isAvailable()) {
            backButton.hide()
            isBackButtonVisible = false
            isOwner.current = false
        }

        // Take ownership if button is visible and no one owns it
        if (shouldShowOnMount && isBackButtonVisible && !isOwner.current) {
            isOwner.current = true
        }

        // Clean up any existing handler and set up new one
        if (currentClickHandler) {
            currentClickHandler()
            currentClickHandler = null
        }

        // Always set up click handler if button should be shown
        if (backButton.onClick.isAvailable() && shouldShowOnMount) {
            const clickHandler = getButtonBehavior()
            const offClick = backButton.onClick(clickHandler)
            currentClickHandler = offClick
        }

        // Cleanup function
        return () => {
            // Clean up handler immediately
            if (currentClickHandler) {
                currentClickHandler()
                currentClickHandler = null
            }

            // Only hide the button if this component owns it and hideOnUnmount is true
            // Use a delay to prevent flickering during navigation
            if (hideOnUnmount && isOwner.current && !shouldShowOnMount) {
                hideTimeout = setTimeout(() => {
                    // Double-check that no new component has taken ownership
                    if (isOwner.current && backButton.hide.isAvailable()) {
                        backButton.hide()
                        isBackButtonVisible = false
                        isOwner.current = false
                    }
                    hideTimeout = null
                }, 50) // Very short delay just to prevent flicker
            }
        }
    }, [navigate, shouldShowOnMount, hideOnUnmount, navigateTo, onBack])

    // Return utility functions for manual control
    const showBackButton = () => {
        if (!isBackButtonVisible && backButton.show.isAvailable()) {
            backButton.show()
            isBackButtonVisible = true
            isOwner.current = true
        }
    }

    const hideBackButton = () => {
        if (isOwner.current && backButton.hide.isAvailable()) {
            backButton.hide()
            isBackButtonVisible = false
            isOwner.current = false
        }
    }

    return {
        showBackButton,
        hideBackButton,
        hasNavigationTarget: !!navigateTo
    }
}
