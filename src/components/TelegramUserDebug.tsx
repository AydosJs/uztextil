import { useTelegramUser } from '@/hooks/useTelegramUser';
import { useTelegramUserData } from '@/lib/hooks';

export function TelegramUserDebug() {
    const { user, userInfo, isLoading, isRegistered, userType } = useTelegramUser();
    const { userData, error, platform, version } = useTelegramUserData();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h3 className="font-bold mb-2">Telegram User Debug</h3>

            <div className="space-y-2">
                <div>
                    <strong>Raw Data:</strong>
                    <pre className="text-xs overflow-auto max-h-20">
                        {JSON.stringify(userData, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Window.Telegram:</strong>
                    <pre className="text-xs overflow-auto max-h-20">
                        {JSON.stringify((window as unknown as { Telegram?: unknown }).Telegram, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Context User:</strong>
                    <pre className="text-xs overflow-auto max-h-20">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>User Info:</strong>
                    <pre className="text-xs overflow-auto max-h-20">
                        {JSON.stringify(userInfo, null, 2)}
                    </pre>
                </div>

                <div>
                    <strong>Status:</strong>
                    <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                    <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
                    <div>Type: {userType || 'None'}</div>

                    <div>Platform: {platform}</div>
                    <div>Version: {version}</div>
                </div>

                {error && (
                    <div className="text-status-error">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="text-status-warning text-xs">
                    <strong>Note:</strong> If you see null user data, make sure:
                    <br />• App is launched from Telegram (not browser)
                    <br />• Bot has WebApp configured
                    <br />• Using inline keyboard button (not custom keyboard)
                </div>
            </div>
        </div>
    );
}
