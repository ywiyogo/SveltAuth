# Development Notes

## API Architecture Overview

The SveltAuth application uses a hybrid approach for handling API requests between the SvelteKit frontend and the Go backend server.

### Development vs Production

#### Development Environment
- **Frontend**: SvelteKit dev server on `http://localhost:5173`
- **Backend**: Go server on `http://localhost:8090`
- **Proxy**: Vite proxy configuration handles `/api/*` requests during development

#### Production Environment
- **Frontend + API Routes**: SvelteKit Node.js server on port 3100 (configurable via PORT env var)
- **Backend**: Go server on `http://localhost:8090`
- **Proxy**: SvelteKit API routes handle `/api/*` requests in production

## API Request Flow

### Development Flow (Vite Proxy)
1. Frontend makes requests to `/api/register`, `/api/login`, etc.
2. Vite dev server intercepts these requests via proxy configuration
3. Vite forwards requests to `http://localhost:8090`, stripping the `/api` prefix
4. Backend processes the request and responds back through Vite
5. Frontend receives the response from the same origin (CORS-free)

### Production Flow (SvelteKit API Routes)
1. Frontend makes requests to `/api/register`, `/api/login`, etc.
2. SvelteKit API routes handle these requests server-side
3. API routes proxy the requests to `http://localhost:8090`
4. Backend processes the request and responds to the SvelteKit server
5. SvelteKit API routes return the response to the frontend

## Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:8090',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
}
```
- **Active**: Development only
- **Purpose**: CORS resolution and request forwarding

### API Proxy Helper (`src/lib/api-proxy.ts`)
- **Active**: Production only
- **Purpose**: Server-side request proxying with proper error handling
- **Features**: Header forwarding, error handling, environment variable support

## API Endpoints

All API endpoints are available at `/api/*` in both development and production:

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `POST /api/verify-otp` - OTP verification
- `POST /api/resend-otp` - OTP resend

### SvelteKit API Route Structure
```
src/routes/api/
├── login/+server.ts
├── logout/+server.ts
├── register/+server.ts
├── resend-otp/+server.ts
└── verify-otp/+server.ts
```

Each route file exports a `POST` handler that uses the shared `handleApiRequest` function.

## Environment Variables

### Backend URL Configuration
- **Default**: `http://localhost:8090`
- **Override**: Set `BACKEND_URL` environment variable
- **Usage**: `BACKEND_URL=http://your-backend:8090 pnpm dev`

## Development Setup

1. **Start Backend Server**:
   ```bash
   # Ensure your Go backend is running on localhost:8090
   curl localhost:8090/health  # Should return healthy status
   ```

2. **Start Frontend Development Server**:
   ```bash
   pnpm dev  # Runs on localhost:5173 with Vite proxy
   ```

## Production Deployment

1. **Build the Application**:
   ```bash
   pnpm build
   ```

2. **Start Production Server**:
   ```bash
   PORT=3100 pm2 start build/index.js --name SveltAuth
   ```

3. **Verify API Routes**:
   ```bash
   curl -X POST http://localhost:3100/api/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass"}'
   ```

## Reverse Proxy Configuration (Caddy)

The production setup uses Caddy as a reverse proxy:

```caddyfile
sveltauth.yobotics.dev {
    reverse_proxy localhost:3100 {
        header_up Host {host}
        header_up X-Real-IP {remote_addr}
        header_up X-Forwarded-For {remote_addr}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

## Troubleshooting

### Common Issues

1. **404 on API endpoints in production**:
   - Ensure SvelteKit API routes are built correctly
   - Check that `build/index.js` contains the API route handlers

2. **Backend connection refused**:
   - Verify backend is running on localhost:8090
   - Check `BACKEND_URL` environment variable if using custom backend URL

3. **CORS issues in development**:
   - Ensure Vite proxy configuration is correct in `vite.config.ts`
   - Restart the dev server after changing proxy settings

### Debug Commands

```bash
# Check if backend is accessible
curl localhost:8090/health

# Test API route in production
curl -X POST localhost:3100/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Check SvelteKit build output
ls -la .svelte-kit/output/server/entries/endpoints/api/
```

## Architecture Benefits

### Why SvelteKit API Routes Over Vite Proxy?

1. **Production Compatibility**: Works in both development and production
2. **Enhanced Control**: Full request/response manipulation capabilities
3. **Error Handling**: Proper error handling and logging
4. **Security**: Can add authentication, rate limiting, validation
5. **Type Safety**: Full TypeScript support with SvelteKit types
6. **Deployment Flexibility**: Works with any SvelteKit deployment target