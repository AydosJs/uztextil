# Environment Variables

## Telegram Configuration

### Telegram Manager Username

To set the Telegram manager username, create a `.env` file in the root directory with:

```
VITE_TELEGRAM_MANAGER_USERNAME=iroda_ex
```

The application will use this environment variable to construct the Telegram link. If not set, it defaults to `iroda_ex`.

### Telegram SDK Usage

Control whether the application uses the Telegram SDK or runs in web mode:

```
VITE_USE_TELEGRAM_SDK=false
```

- **`true`** (default): Use Telegram SDK when running in Telegram environment. This is the default behavior for backward compatibility.
- **`false`**: Disable Telegram SDK completely and run in web mode, even if detected in Telegram environment.

When set to `false`, the app will:
- Skip Telegram SDK initialization
- Use web-safe defaults for safe areas
- Disable Telegram back button functionality
- Use standard browser APIs instead of Telegram WebApp methods

This is useful when deploying the app as a standalone web application.
