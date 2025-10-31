export const API_CONFIG = {
    OPENAPI_URL: 'https://texttile.dclinics.uz/swagger/?format=openapi',
    SWAGGER_URL: 'https://texttile.dclinics.uz/swagger.json',
    BASE_URL: 'https://texttile.dclinics.uz',
} as const;

export const TELEGRAM_CONFIG = {
    MANAGER_USERNAME: import.meta.env.VITE_TELEGRAM_MANAGER_USERNAME || 'iroda_ex',
    BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'uztextile_bot',
} as const;

export const TELEGRAM_SDK_CONFIG = {
    // Controls whether to use Telegram SDK. When false, app runs in web mode without SDK dependencies.
    // Set via VITE_USE_TELEGRAM_SDK environment variable (default: true for backward compatibility)
    USE_TELEGRAM_SDK: true,
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