import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { backButton } from "@telegram-apps/sdk"

interface UseTelegramBackButtonOptions {
    /** Whether to show the back button when component mounts (default: true) */
    showOnMount?: boolean
    /** Whether to hide the back button when component unmounts (default: true) */
    hideOnUnmount?: boolean
}

/**
 * Custom hook for managing Telegram Mini App back button functionality
 * Always navigates back one step in history (navigate(-1))
 * 
 * @example
 * // Basic usage - shows back button and navigates back one step
 * useTelegramBackButton()
 * 
 * @example
 * // Don't show back button automatically
 * useTelegramBackButton({
 *   showOnMount: false
 * })
 * 
 * @example
 * // Manual control with returned functions
 * const { showBackButton, hideBackButton } = useTelegramBackButton({
 *   showOnMount: false
 * })
 * 
 * // Show button when needed
 * showBackButton()
 * 
 * // Hide button when needed
 * hideBackButton()
 */
export const useTelegramBackButton = (options: UseTelegramBackButtonOptions = {}) => {
    const navigate = useNavigate()
    const {
        showOnMount = true,
        hideOnUnmount = true
    } = options

    useEffect(() => {
        // Show the back button when component mounts if showOnMount is true
        if (showOnMount && backButton.show.isAvailable()) {
            backButton.show()
        }

        // Set up click handler for back button
        if (backButton.onClick.isAvailable()) {
            const offClick = backButton.onClick(() => {
                // Always navigate back one step in history
                navigate(-1)
            })

            // Cleanup function to remove listener and hide button
            return () => {
                offClick()
                if (hideOnUnmount && backButton.hide.isAvailable()) {
                    backButton.hide()
                }
            }
        }

        // Cleanup function if onClick is not available
        return () => {
            if (hideOnUnmount && backButton.hide.isAvailable()) {
                backButton.hide()
            }
        }
    }, [navigate, showOnMount, hideOnUnmount])

    // Return utility functions for manual control
    const showBackButton = () => {
        if (backButton.show.isAvailable()) {
            backButton.show()
        }
    }

    const hideBackButton = () => {
        if (backButton.hide.isAvailable()) {
            backButton.hide()
        }
    }

    return {
        showBackButton,
        hideBackButton
    }
}
