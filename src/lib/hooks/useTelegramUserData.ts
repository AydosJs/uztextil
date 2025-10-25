import { useEffect, useState } from 'react';
import { initDataUser } from '@telegram-apps/sdk-react';
import { isTelegramEnvironment } from '@/utils/environmentUtils';
import { getMockUserData, getStoredMockUserData, storeMockUserData } from '@/utils/mockTelegramUser';



export interface TelegramUserData {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    isBot?: boolean;
    phoneNumber?: string;
}

export interface TelegramWebAppData {
    userData: TelegramUserData | null;
    isLoading: boolean;
    error: string | null;
    platform: string;
    version: string;
}

export function useTelegramUserData(): TelegramWebAppData {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let hasData = false;

        const extractUserData = () => {
            if (hasData) return; // Prevent multiple calls

            try {
                // Check if we're in a web browser environment
                if (!isTelegramEnvironment()) {
                    console.log('Web browser environment detected, using mock user data');

                    // Try to get stored mock user data first
                    const storedData = getStoredMockUserData();
                    if (storedData) {
                        setUserData(storedData);
                        hasData = true;
                        setIsLoading(false);
                        return;
                    }

                    // Generate new mock user data
                    const mockData = getMockUserData();
                    setUserData(mockData);
                    storeMockUserData(mockData); // Store for persistence
                    hasData = true;
                    setIsLoading(false);
                    return;
                }

                // Get user data using the React SDK (Telegram environment)
                const user = initDataUser();

                console.log('Raw Telegram user data from React SDK:', user);

                if (user) {
                    setUserData({
                        id: user.id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        username: user.username,
                        languageCode: user.language_code,
                        isBot: user.is_bot,
                        phoneNumber: (user as { phone_number?: string }).phone_number,
                    });
                    hasData = true;
                    setIsLoading(false);
                } else {
                    setError('No user data found');
                    setIsLoading(false);
                }
            } catch (err) {
                setError('Failed to get user data');
                console.error('Error:', err);
                setIsLoading(false);
            }
        };

        // Try immediately first
        extractUserData();

        // If no data, try again after a short delay
        const timer = setTimeout(extractUserData, 100);

        return () => clearTimeout(timer);
    }, []); // Empty dependency array - only run once

    return {
        userData,
        isLoading,
        error,
        platform: isTelegramEnvironment() ? 'telegram' : 'web',
        version: '1.0' // Default version
    };
}
