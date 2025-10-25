import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Component to track and log current page
export function RouteLogger() {
    const location = useLocation();

    useEffect(() => {
        console.log('📍 Current Page:', location.pathname);
        console.log('🔍 Full URL:', window.location.href);
        console.log('📊 Route State:', location.state);
    }, [location]);

    return null;
}
