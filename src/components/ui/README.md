# UI Components

## Toast Notifications (Sonner)

The project now uses Sonner for toast notifications instead of browser alerts. This provides a better user experience with styled, dismissible notifications.

### Usage

Import the toast utility:

```typescript
import { showToast } from "@/lib/utils"
```

### Available Methods

- `showToast.success(message)` - Green success notification
- `showToast.error(message)` - Red error notification  
- `showToast.warning(message)` - Yellow warning notification
- `showToast.info(message)` - Blue info notification

### Examples

```typescript
// Success message
showToast.success('Muvaffaqiyatli yaratildi!')

// Error message
showToast.error('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')

// Warning message
showToast.warning('Iltimos, shartlarni o\'qib chiqing va tasdiqlang')

// Info message
showToast.info('Ma\'lumot saqlandi')
```

### Global Setup

The `Toaster` component is already added to `App.tsx` and will display all toast notifications globally.

### Styling

Toasts are styled to match the dark theme of the application with colored left borders for different types:
- Success: Green (#10b981)
- Error: Red (#ef4444)  
- Warning: Yellow (#f59e0b)
- Info: Blue (#3b82f6)
