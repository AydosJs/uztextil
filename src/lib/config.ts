export const API_CONFIG = {
    OPENAPI_URL: 'https://texttile.dclinics.uz/swagger/?format=openapi',
    SWAGGER_URL: 'https://texttile.dclinics.uz/swagger.json',
    BASE_URL: 'https://texttile.dclinics.uz',
} as const;

export const TELEGRAM_CONFIG = {
    MANAGER_USERNAME: import.meta.env.VITE_TELEGRAM_MANAGER_USERNAME || 'iroda_ex',
    BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'uztextil_bot',
} as const;

export const DEV_CONFIG = {
    ENABLE_MOCK_USER: true, // Auto-detect or force mock
    MOCK_TELEGRAM_ID: 296875296,
    MOCK_USER_DATA: {
        id: 296875296,
        firstName: 'Aydos',
        lastName: '',
        username: 'sankibayev',
        languageCode: 'en',
        isBot: false,
        phoneNumber: '+998901234567'
    }
} as const;