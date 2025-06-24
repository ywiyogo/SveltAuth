# Deployment Guide

## Quick Start

### Build and Copy Only
```bash
./scripts/deploy.sh user@host:/path
```

### Build, Copy and Deploy
```bash
./scripts/deploy.sh user@host:/path --deploy
```

### With Environment Variables
```bash
PORT=3100 BACKEND_URL=http://localhost:8090 PM2_APP_NAME=SveltAuth ./scripts/deploy.sh user@host:/path --deploy
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3100` | Application port |
| `BACKEND_URL` | `http://localhost:8090` | Backend server URL |
| `PM2_APP_NAME` | `SveltAuth` | PM2 process name |

## What It Does

### Without --deploy
1. Builds the app locally
2. Creates `svelteauth-deploy.tar.gz`
3. Uploads to server
4. Done (manual extraction needed)

### With --deploy
1. Builds the app locally
2. Creates and uploads package
3. Extracts on server
4. Installs dependencies
5. Starts/restarts PM2 process

## Manual Commands on Server

```bash
# Extract package
tar -xzf svelteauth-deploy.tar.gz

# Install dependencies
pnpm install --prod

# Start with PM2
PORT=3100 pm2 start build/index.js --name SveltAuth

# Check status
pm2 status

# View logs
pm2 logs SveltAuth
```

## Examples

```bash
# Deploy to production
./scripts/deploy.sh root@myserver.com:/home/sveltauth --deploy

# Copy to staging
./scripts/deploy.sh user@staging:/var/www/app

# Custom configuration
PORT=8080 PM2_APP_NAME=MyApp ./scripts/deploy.sh user@host:/path --deploy
```
