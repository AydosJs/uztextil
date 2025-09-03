import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { Spinner } from '@/components/ui';

interface GlobalAuthGuardProps {
    children: React.ReactNode;
}

export function GlobalAuthGuard({ children }: GlobalAuthGuardProps) {
    const { user, isLoading, isRegistered, userType } = useTelegramUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Don't redirect if still loading
        if (isLoading) return;

        // Don't redirect if no user data available yet
        if (!user) return;

        // Don't redirect if already on the correct page
        const currentPath = location.pathname;

        if (!isRegistered) {
            // User is not registered, redirect to choose department
            if (currentPath !== '/choose-department') {
                navigate('/choose-department');
            }
            return;
        }

        if (isRegistered && userType) {
            // User is registered, allow them to stay on current page or redirect to app page if on wrong page
            // Allow navigation to services page and terms page, but redirect other pages to app page
            if (currentPath !== '/' && currentPath !== '/services' && currentPath !== '/services/terms') {
                navigate('/');
            }
            return;
        }
    }, [user, isLoading, isRegistered, userType, navigate, location.pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-white">Loading user data...</p>
            </div>
        );
    }

    return <>{children}</>;
}
