import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { GlobalLoading } from '@/components/ui';

interface RouteGuardProps {
    children: React.ReactNode;
    allowedUserType?: 'customer' | 'manufacturer';
    requireRegistration?: boolean;
    preventIfRegistered?: boolean;
}

// Guard for specific user type routes - only allow if user is registered for the specified department
export function UserTypeRouteGuard({ children, allowedUserType }: RouteGuardProps) {
    const { user, isLoading, userInfo } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user || !userInfo) return;

        // Check if user is registered for the specific department
        const isRegisteredForThisDepartment = (allowedUserType === 'customer' && userInfo.customer) ||
            (allowedUserType === 'manufacturer' && userInfo.manufacturer);

        if (!isRegisteredForThisDepartment) {
            // If not registered for this department, redirect to choose department
            navigate('/choose-department');
        }
    }, [user, isLoading, userInfo, allowedUserType, navigate]);

    if (isLoading) {
        return <GlobalLoading />;
    }

    // Check if user is registered for the specific department
    const isRegisteredForThisDepartment = userInfo && (
        (allowedUserType === 'customer' && userInfo.customer) ||
        (allowedUserType === 'manufacturer' && userInfo.manufacturer)
    );

    if (!isRegisteredForThisDepartment) {
        return null; // Will redirect
    }

    return <>{children}</>;
}


// Guard for choose-department - allow access regardless of registration status
export function ChooseDepartmentGuard({ children }: RouteGuardProps) {
    const { user, isLoading } = useTelegramUser();

    if (isLoading || !user) {
        return <GlobalLoading />;
    }

    // Always allow access to choose department page
    return <>{children}</>;
}

// Guard for registration routes - allow access if user is not registered for this specific department yet
export function RegistrationRouteGuard({ children, allowedUserType }: RouteGuardProps) {
    const { user, isLoading, userInfo } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user || !userInfo) return;

        // Check if user is already registered for the specific department
        const isRegisteredForThisDepartment = (allowedUserType === 'customer' && userInfo.customer) ||
            (allowedUserType === 'manufacturer' && userInfo.manufacturer);

        // If user is already registered for this specific department, redirect to services
        if (isRegisteredForThisDepartment) {
            navigate('/services', { state: { department: allowedUserType } });
        }
    }, [user, isLoading, userInfo, allowedUserType, navigate]);

    if (isLoading) {
        return <GlobalLoading />;
    }

    // Check if user is already registered for this specific department
    const isRegisteredForThisDepartment = userInfo && (
        (allowedUserType === 'customer' && userInfo.customer) ||
        (allowedUserType === 'manufacturer' && userInfo.manufacturer)
    );

    if (isRegisteredForThisDepartment) {
        return null; // Will redirect
    }

    return <>{children}</>;
}

// Guard for services routes - allow access if user is registered for any department
export function ServicesRouteGuard({ children }: RouteGuardProps) {
    const { user, isLoading, userInfo } = useTelegramUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading || !user || !userInfo) return;

        // Check if user is registered for any department
        const isRegisteredForAnyDepartment = userInfo.customer || userInfo.manufacturer;

        if (!isRegisteredForAnyDepartment) {
            // If user is not registered for any department, redirect to choose department
            console.log('User not registered for any department, redirecting to choose-department')
            navigate('/choose-department');
        }
    }, [user, isLoading, userInfo, navigate]);

    if (isLoading) {
        return <GlobalLoading />;
    }

    // Check if user is registered for any department
    const isRegisteredForAnyDepartment = userInfo && (userInfo.customer || userInfo.manufacturer);

    if (!isRegisteredForAnyDepartment) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
