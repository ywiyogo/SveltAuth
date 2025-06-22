# Development Notes

## CORS Proxy Configuration

To resolve CORS issues when making API requests from the SvelteKit frontend (`http://localhost:5174`) to the backend (`http://localhost:8090`), a proxy configuration has been set up in `vite.config.ts`. This allows the frontend to make requests to the same origin, which are then forwarded to the backend by Vite.

### Configuration Details

- **Proxy Path**: `/api`
- **Target Backend**: `http://localhost:8090`
- **Configuration Location**: `vite.config.ts` under `server.proxy`
- **API Base in Code**: Updated to `/api` in `src/lib/api.ts`

### How It Works

1. The frontend makes API requests to `/api` endpoints (e.g., `/api/auth/register`).
2. Vite intercepts these requests and forwards them to `http://localhost:8090`, stripping the `/api` prefix.
3. The backend processes the request and responds to Vite, which then relays the response back to the frontend.
4. From the browser's perspective, all requests are made to the same origin (`http://localhost:5174`), thus bypassing CORS restrictions.

### Notes

- This proxy configuration is only active in the development environment with Vite. In production, ensure that the backend is configured to handle CORS appropriately or use a reverse proxy if needed.
- If the backend port changes, update the `target` in `vite.config.ts` accordingly.