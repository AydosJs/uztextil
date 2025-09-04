import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { Spinner } from '@/components/ui';

interface RouteGuardProps {
    children: React.ReactNode;
    allowedUserType?: 'customer' | 'manufacturer';
    requireRegistration?: boolean;
    preventIfRegistered?: boolean;
}

// Guard for specific user type routes - only allow if user is registered as the specified type
export function UserTypeRouteGuard({ children, allowedUserType }: RouteGuardProps) {
    const { user, isLoading, isRegistered, userType } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user) return;

        if (!isRegistered || userType !== allowedUserType) {
            // If not registered or not the correct user type, redirect to choose department
            navigate('/choose-department');
        }
    }, [user, isLoading, isRegistered, userType, allowedUserType, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    if (!isRegistered || userType !== allowedUserType) {
        return null; // Will redirect
    }

    return <>{children}</>;
}


// Guard for choose-department - only allow if user is not registered
export function ChooseDepartmentGuard({ children }: RouteGuardProps) {
    const { user, isLoading, isRegistered, userType } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user) return;

        if (isRegistered && userType) {
            // If user is already registered, redirect to services
            navigate('/services');
        }
    }, [user, isLoading, isRegistered, userType, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    if (isRegistered && userType) {
        return null; // Will redirect
    }

    return <>{children}</>;
}

// Guard for services routes - only allow if user is registered
export function ServicesRouteGuard({ children }: RouteGuardProps) {
    const { user, isLoading, isRegistered } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user) return;

        if (!isRegistered) {
            // If user is not registered, redirect to choose department
            navigate('/choose-department');
        }
    }, [user, isLoading, isRegistered, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full safe-area-pt w-full dark flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    if (!isRegistered) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
