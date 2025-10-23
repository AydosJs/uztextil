import { useState, useEffect, useCallback, useRef } from 'react';
import { useTelegramUserData } from '@/lib/hooks';
import { customInstance } from '@/lib/api-client';
import type { TelegramUser, TelegramUserInfo } from '@/types/telegram';
import type { TelegramUserContextType, TelegramUserProviderProps } from '@/types/telegramContext';
import { TelegramUserContext } from './TelegramUserContextInstance';

export function TelegramUserProvider({ children }: TelegramUserProviderProps) {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [userInfo, setUserInfo] = useState<TelegramUserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const hasRegistered = useRef(false);
    const registrationAttempted = useRef(false);

    // Use the hook to get Telegram user data
    const { userData, isLoading: isDataLoading, error } = useTelegramUserData();

    // No longer using the info API - getting data directly from register response

    const registerUser = useCallback(async () => {
        if (!user?.telegram_id || isRegistering || registrationAttempted.current) return;

        registrationAttempted.current = true;
        setIsRegistering(true);
        setIsLoading(true);
        try {
            // Send user data to the registration endpoint using customInstance
            const responseData = await customInstance<TelegramUserInfo>({
                url: '/api/v1/bot-user/register/',
                method: 'POST',
                data: {
                    telegram_id: user.telegram_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    phone_number: user.phone_number,
                    language_code: user.language_code,
                    is_bot: user.is_bot,
                    is_active: user.is_active,
                    created_at: user.created_at,
                }
            });

            console.log('User registered successfully, response:', responseData);

            // Set userInfo directly from the register response
            if (responseData) {
                setUserInfo(responseData as TelegramUserInfo);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Registration failed:', error);
            setIsLoading(false);
        } finally {
            setIsRegistering(false);
        }
    }, [user, isRegistering]);

    const fetchUserInfo = useCallback(async () => {
        // No longer needed - user info is set directly from register response
        console.log('fetchUserInfo called but no longer needed');
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
        setUserInfo(null);
        // Clear telegram_id and user_department from localStorage
        localStorage.removeItem('telegram_id');
        localStorage.removeItem('user_department');
    }, []);

    const updateUserInfo = useCallback((newUserInfo: TelegramUserInfo) => {
        setUserInfo(newUserInfo);
    }, []);

    // Extract user data from Telegram initData
    useEffect(() => {
        if (isDataLoading || hasRegistered.current) return;

        if (error) {
            console.error('Failed to extract user data:', error);
            setIsLoading(false);
            return;
        }

        if (userData) {
            const telegramUser: TelegramUser = {
                telegram_id: userData.id,
                first_name: userData.firstName || '',
                last_name: userData.lastName || '',
                username: userData.username || '',
                phone_number: userData.phoneNumber || '',
                language_code: userData.languageCode || 'en',
                is_bot: userData.isBot || false,
                is_active: true,
                created_at: new Date().toISOString(),
            };

            setUser(telegramUser);
            // Store telegram_id in localStorage for API client access
            localStorage.setItem('telegram_id', userData.id.toString());
            hasRegistered.current = true;
        } else {
            console.warn('No user data found in initData');
            setIsLoading(false);
        }
    }, [userData, isDataLoading, error]);

    // Register user when user data is set
    useEffect(() => {
        if (user && !isRegistering && !registrationAttempted.current) {
            registerUser();
        }
    }, [user, isRegistering, registerUser]);

    // No longer making separate API calls for user info

    // Determine if user is registered and what type
    // User is registered if customer or manufacturer has a truthy value (not null)
    const isRegistered = Boolean(userInfo?.customer || userInfo?.manufacturer);
    const userType = userInfo?.customer ? 'customer' :
        userInfo?.manufacturer ? 'manufacturer' : null;

    const value: TelegramUserContextType = {
        user,
        userInfo,
        isLoading,
        isRegistered,
        userType,
        registerUser,
        fetchUserInfo,
        clearUser,
        updateUserInfo,
    };

    return (
        <TelegramUserContext.Provider value={value}>
            {children}
        </TelegramUserContext.Provider>
    );
}


