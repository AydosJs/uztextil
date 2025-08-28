# Orval Configuration for UzTextil

This project uses Orval to automatically generate TypeScript API client code from OpenAPI specifications.

## Configuration

The Orval configuration is set up in `orval.config.ts` with two API sources:

1. **Main API** (`uztextil`): `http://165.22.66.5/swagger/?format=openapi`
2. **Redocs API** (`uztextilRedocs`): `http://165.22.66.5/swagger.json`

## Usage

### Generate API Code

```bash
# Generate API code once
bun run generate:api

# Generate API code and watch for changes
bun run generate:api:watch
```

### Generated Files

After running the generate command, Orval will create:

- `src/lib/api/` - Main API client and types
- `src/lib/api-redocs/` - Redocs API client and types
- `src/lib/api/model/` - Shared model types
- `src/lib/api-redocs/model/` - Redocs-specific model types

### API Client

The generated API client uses:
- **Base URL**: `http://165.22.66.5`
- **HTTP Client**: Axios with interceptors
- **Authentication**: Bearer token from localStorage
- **Error Handling**: Automatic redirect on 401 errors

### Example Usage

```typescript
import { useGetUsers } from '@/lib/api';

function UsersComponent() {
  const { data: users, isLoading, error } = useGetUsers();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Configuration Files

- `orval.config.ts` - Main Orval configuration
- `src/lib/config.ts` - API configuration constants
- `src/lib/api-client.ts` - Axios instance with interceptors

## Dependencies

- `orval` - API code generation
- `axios` - HTTP client
- `@tanstack/react-query` - React Query for data fetching (generated)
