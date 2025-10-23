export const API_CONFIG = {
    OPENAPI_URL: 'https://texttile.dclinics.uz/swagger/?format=openapi',
    SWAGGER_URL: 'https://texttile.dclinics.uz/swagger.json',
    BASE_URL: 'https://texttile.dclinics.uz',
} as const;

export const TELEGRAM_CONFIG = {
    MANAGER_USERNAME: import.meta.env.VITE_TELEGRAM_MANAGER_USERNAME || 'iroda_ex',
} as const;