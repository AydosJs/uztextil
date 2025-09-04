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

        // if (isRegistered && userType) {
        //     // User is registered, check if they're on manufacturer or customer registration pages
        //     const isOnManufacturerRegister = currentPath.startsWith('/manufacturer/register');
        //     const isOnCustomerRegister = currentPath.startsWith('/customer/register');

        //     // If user is on manufacturer or customer registration pages, allow them to stay
        //     // If user is on other pages, redirect to app page
        //     if (!isOnManufacturerRegister && !isOnCustomerRegister && currentPath !== '/' && currentPath !== '/services') {
        //         navigate('/');
        //     }
        //     return;
        // }
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
