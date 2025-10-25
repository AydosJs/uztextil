import type { TelegramUserData } from '@/lib/hooks/useTelegramUserData';

/**
 * Mock Telegram user data for web browser development
 * Using real user data from Telegram for more realistic testing
 */

const MOCK_USER_DATA: TelegramUserData = {
    id: 296875296,
    firstName: 'Aydos',
    lastName: '',
    username: 'sankibayev',
    languageCode: 'en',
    isBot: false,
    phoneNumber: '+998901234567' // Mock phone number since it's not in the real data
};

/**
 * Gets mock user data for web browser development
 * @returns Mock Telegram user data
 */
export function getMockUserData(): TelegramUserData {
    // Check if there are URL parameters to override mock data
    const urlParams = new URLSearchParams(window.location.search);

    const mockData = { ...MOCK_USER_DATA };

    // Allow URL parameters to override mock data for testing
    if (urlParams.get('mock_id')) {
        mockData.id = parseInt(urlParams.get('mock_id')!) || MOCK_USER_DATA.id;
    }
    if (urlParams.get('mock_first_name')) {
        mockData.firstName = urlParams.get('mock_first_name')!;
    }
    if (urlParams.get('mock_last_name')) {
        mockData.lastName = urlParams.get('mock_last_name')!;
    }
    if (urlParams.get('mock_username')) {
        mockData.username = urlParams.get('mock_username')!;
    }
    if (urlParams.get('mock_language')) {
        mockData.languageCode = urlParams.get('mock_language')!;
    }

    return mockData;
}

/**
 * Stores mock user data in localStorage for persistence
 * @param userData Mock user data to store
 */
export function storeMockUserData(userData: TelegramUserData): void {
    try {
        localStorage.setItem('mock_telegram_user', JSON.stringify(userData));
    } catch (error) {
        console.warn('Failed to store mock user data:', error);
    }
}

/**
 * Retrieves stored mock user data from localStorage
 * @returns Stored mock user data or null if not found
 */
export function getStoredMockUserData(): TelegramUserData | null {
    try {
        const stored = localStorage.getItem('mock_telegram_user');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.warn('Failed to retrieve stored mock user data:', error);
        return null;
    }
}

/**
 * Clears stored mock user data from localStorage
 */
export function clearMockUserData(): void {
    try {
        localStorage.removeItem('mock_telegram_user');
    } catch (error) {
        console.warn('Failed to clear mock user data:', error);
    }
}
