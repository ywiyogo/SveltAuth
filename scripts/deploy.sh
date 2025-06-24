#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Usage
if [ $# -eq 0 ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 <target> [--deploy]"
    echo ""
    echo "Examples:"
    echo "  $0 user@host:/path                    # Build and copy only"
    echo "  $0 user@host:/path --deploy           # Build, copy and deploy"
    echo ""
    echo "Environment variables:"
    echo "  PORT=3100          # App port (default: 3100)"
    echo "  BACKEND_URL=...    # Backend URL (default: http://localhost:8090)"
    echo "  PM2_APP_NAME=...   # PM2 name (default: SveltAuth)"
    exit 1
fi

TARGET="$1"
DEPLOY_MODE=""
if [ "$2" = "--deploy" ]; then
    DEPLOY_MODE="true"
fi

# Validate target
if [[ ! "$TARGET" =~ ^[^@]+@[^:]+:.+ ]]; then
    print_error "Invalid target format. Expected: user@host:/path"
    exit 1
fi

IFS=':' read -r SSH_TARGET REMOTE_PATH <<< "$TARGET"

# Test SSH
print_info "Testing SSH connection..."
if ! ssh -o ConnectTimeout=10 "$SSH_TARGET" "echo 'OK'" >/dev/null 2>&1; then
    print_error "Cannot connect to $SSH_TARGET"
    exit 1
fi

# Build
print_info "Building application..."
pnpm install --frozen-lockfile
pnpm build

if [ ! -d "build" ]; then
    print_error "Build failed"
    exit 1
fi

# Package
print_info "Creating package..."
PACKAGE="svelteauth-deploy.tar.gz"
rm -f "$PACKAGE"
tar -czf "$PACKAGE" build/ package.json pnpm-lock.yaml

# Upload
print_info "Uploading to $SSH_TARGET:$REMOTE_PATH..."
ssh "$SSH_TARGET" "mkdir -p '$REMOTE_PATH'"
scp "$PACKAGE" "$SSH_TARGET:$REMOTE_PATH/"

if [ "$DEPLOY_MODE" = "true" ]; then
    print_info "Deploying on remote server..."

    # Create remote deploy script
    cat > deploy-remote.sh << 'EOF'
#!/bin/bash
set -e
cd "$1"

# Add common paths to PATH in case pnpm/pm2 are installed in non-standard locations
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin:$HOME/.local/bin:$HOME/.npm-packages/bin"

tar -xzf svelteauth-deploy.tar.gz



# Try to find pnpm in various locations
PNPM_CMD=""
if command -v pnpm &> /dev/null; then
    PNPM_CMD="pnpm"
    echo "Found pnpm via command -v"
elif [ -f /usr/lib/node_modules/corepack/shims/pnpm ]; then
    PNPM_CMD="/usr/lib/node_modules/corepack/shims/pnpm"
    echo "Found pnpm via corepack shims"
elif [ -f /usr/local/bin/pnpm ]; then
    PNPM_CMD="/usr/local/bin/pnpm"
    echo "Found pnpm at /usr/local/bin/pnpm"
elif [ -f "$HOME/.local/bin/pnpm" ]; then
    PNPM_CMD="$HOME/.local/bin/pnpm"
    echo "Found pnpm at $HOME/.local/bin/pnpm"
elif [ -f "$HOME/.npm-packages/bin/pnpm" ]; then
    PNPM_CMD="$HOME/.npm-packages/bin/pnpm"
    echo "Found pnpm at $HOME/.npm-packages/bin/pnpm"
fi

# Install dependencies
if [ -n "$PNPM_CMD" ]; then
    echo "Using pnpm: $PNPM_CMD"
    $PNPM_CMD install --prod --frozen-lockfile
else
    echo "pnpm not found, using npm instead"
    npm install --omit=dev
fi

# Install PM2 if not available
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

pm2 stop "${PM2_APP_NAME:-SveltAuth}" 2>/dev/null || true
pm2 delete "${PM2_APP_NAME:-SveltAuth}" 2>/dev/null || true
PORT="${PORT:-3100}" BACKEND_URL="${BACKEND_URL:-http://localhost:8090}" pm2 start build/index.js --name "${PM2_APP_NAME:-SveltAuth}"
pm2 save
rm -f svelteauth-deploy.tar.gz
EOF

    scp deploy-remote.sh "$SSH_TARGET:$REMOTE_PATH/"
    ssh "$SSH_TARGET" "cd '$REMOTE_PATH' && chmod +x deploy-remote.sh && PORT='${PORT:-3100}' BACKEND_URL='${BACKEND_URL:-http://localhost:8090}' PM2_APP_NAME='${PM2_APP_NAME:-SveltAuth}' ./deploy-remote.sh '$REMOTE_PATH'"

    print_success "Deployed successfully!"
    echo "Check status: ssh $SSH_TARGET 'pm2 status'"
else
    print_success "Package uploaded to $REMOTE_PATH/"
    echo "To deploy: ssh $SSH_TARGET 'cd $REMOTE_PATH && tar -xzf svelteauth-deploy.tar.gz'"
fi

# Cleanup
rm -f "$PACKAGE" deploy-remote.sh
