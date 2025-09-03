export interface TelegramUser {
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    language_code: string;
    is_bot: boolean;
    is_active: boolean;
    created_at: string;
    type?: 'manufacturer' | 'customer';
}

export interface TelegramUserInfo {
    user_id: number; // User ID from /api/v1/bot-user/register/ response
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    language_code: string;
    is_bot: boolean;
    customer?: number | null; // Customer ID or null
    manufacturer?: number | null; // Manufacturer ID or null
    is_new: boolean; // Whether this is a new user
    message: string; // Response message
    success: boolean; // Whether the operation was successful
}
