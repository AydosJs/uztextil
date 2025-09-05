import { useState, useEffect } from 'react'
import { isMobileDevice } from '@/utils/deviceUtils'

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        return isMobileDevice()
    })

    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = isMobileDevice()
            setIsMobile(mobile)
        }

        // Check on mount
        checkIsMobile()

        // Listen for resize events
        window.addEventListener('resize', checkIsMobile)

        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    return isMobile
}
