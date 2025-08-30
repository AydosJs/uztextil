import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { backButton } from "@telegram-apps/sdk"

// Global state to track if back button is currently visible
let isBackButtonVisible = false
let currentClickHandler: (() => void) | null = null

interface UseTelegramBackButtonOptions {
    /** Whether to show the back button when component mounts (default: true) */
    showOnMount?: boolean
    /** Whether to hide the back button when component unmounts (default: true) */
    hideOnUnmount?: boolean
}

/**
 * Custom hook for managing Telegram Mini App back button functionality
 * Always navigates back one step in history (navigate(-1))
 * Prevents multiple back buttons from being shown simultaneously
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

    // Use ref to track if this component is responsible for the back button
    const isOwner = useRef(false)

    useEffect(() => {
        // Only show the back button if it's not already visible and showOnMount is true
        if (showOnMount && !isBackButtonVisible && backButton.show.isAvailable()) {
            backButton.show()
            isBackButtonVisible = true
            isOwner.current = true
        }

        // Set up click handler for back button only if not already set
        if (backButton.onClick.isAvailable() && !currentClickHandler) {
            const clickHandler = () => {
                // Always navigate back one step in history
                navigate(-1)
            }

            const offClick = backButton.onClick(clickHandler)
            currentClickHandler = offClick

            // Cleanup function to remove listener and hide button
            return () => {
                if (currentClickHandler) {
                    currentClickHandler()
                    currentClickHandler = null
                }
                // Only hide the button if this component owns it and hideOnUnmount is true
                if (hideOnUnmount && isOwner.current && backButton.hide.isAvailable()) {
                    backButton.hide()
                    isBackButtonVisible = false
                    isOwner.current = false
                }
            }
        }

        // Cleanup function if onClick is not available
        return () => {
            // Only hide the button if this component owns it and hideOnUnmount is true
            if (hideOnUnmount && isOwner.current && backButton.hide.isAvailable()) {
                backButton.hide()
                isBackButtonVisible = false
                isOwner.current = false
            }
        }
    }, [navigate, showOnMount, hideOnUnmount])

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
        hideBackButton
    }
}
