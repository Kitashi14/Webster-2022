#!/usr/bin/env bash
set -euo pipefail

# start.sh — Docker-first launcher with local fallback
# - If Docker is available, build containers and run via docker-compose
# - Otherwise install Node (via nvm) if necessary, install deps and run frontend + backend locally

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

log() { echo -e "[start.sh] $*"; }
err() { echo -e "[start.sh][ERROR] $*" >&2; }

cleanup_pids=()
cleanup() {
    log "Cleaning up..."
    for pid in "${cleanup_pids[@]:-}"; do
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            log "Killing $pid"
            kill "$pid" || true
        fi
    done
    # If docker-compose brought containers up as detached, leave them running by design.
    exit 0
}
trap cleanup INT TERM

has_command() { command -v "$1" >/dev/null 2>&1; }

### Docker path
if has_command docker; then
    # prefer docker compose (v2) if available
    DOCKER_COMPOSE_CMD=""
    if has_command docker-compose; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    fi

    if [ -n "$DOCKER_COMPOSE_CMD" ]; then
        log "Docker available. Using docker compose: $DOCKER_COMPOSE_CMD"

        # Create minimal Dockerfiles + docker-compose.yml if they don't exist
        # Backend Dockerfile
        if [ ! -f backend/Dockerfile ]; then
            cat > backend/Dockerfile <<'EOF'
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV PORT=4000
EXPOSE 4000
CMD ["npm","start"]
EOF
            log "Wrote backend/Dockerfile"
        fi

        # Frontend Dockerfile
        if [ ! -f frontend/Dockerfile ]; then
            cat > frontend/Dockerfile <<'EOF'
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
EOF
            log "Wrote frontend/Dockerfile"
        fi

        # docker-compose.yml
        if [ ! -f docker-compose.yml ]; then
            cat > docker-compose.yml <<EOF
version: '3.8'
services:
    backend:
        build: ./backend
        ports:
            - "4000:4000"
        environment:
            - NODE_ENV=development
        shm_size: '1gb'
    frontend:
        build: ./frontend
        ports:
            - "3000:3000"
        environment:
            - CHOKIDAR_USEPOLLING=true
EOF
            log "Wrote docker-compose.yml"
        fi

        # Build and run
        log "Building images and starting containers (this may take a few minutes)..."
        # Use the selected compose command
        eval "$DOCKER_COMPOSE_CMD build --parallel"
        eval "$DOCKER_COMPOSE_CMD up --remove-orphans -d"

        log "Services started via docker compose."
        log "Backend -> http://localhost:4000"
        log "Frontend -> http://localhost:3000"
        exit 0
    else
        log "Docker found but docker compose not available. Proceeding to local fallback."
    fi
else
    log "Docker not available. Proceeding to local bootstrap."
fi

### Local fallback: ensure Node (via nvm) and run locally
ensure_nvm_and_node() {
    if has_command node && has_command npm; then
        log "Node and npm already installed: $(node --version) $(npm --version)"
        return
    fi

    # install nvm if missing
    if [ -z "${NVM_DIR:-}" ] && ! has_command nvm; then
        log "Installing nvm (Node Version Manager)..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        # shellcheck disable=SC1090
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    else
        # try to source nvm if present
        if [ -s "$HOME/.nvm/nvm.sh" ]; then
            # shellcheck disable=SC1090
            . "$HOME/.nvm/nvm.sh"
        fi
    fi

    if ! has_command node; then
        log "Installing latest LTS Node.js via nvm..."
        nvm install --lts
        nvm use --lts
    fi

    if ! has_command npm; then
        err "npm not available after node install"
        exit 1
    fi
}

install_and_start_local() {
    # Backend
    if [ -d backend ]; then
        log "Installing backend dependencies..."
        cd backend
        npm install || { err "npm install failed in backend"; exit 1; }
        log "Starting backend (npm start)..."
        npm start &
        BACKEND_PID=$!
        cleanup_pids+=("$BACKEND_PID")
        cd "$SCRIPT_DIR"
    else
        err "backend directory not found"
    fi

    # Wait a couple seconds for backend to initialize
    sleep 2

    # Frontend
    if [ -d frontend ]; then
        log "Installing frontend dependencies..."
        cd frontend
        npm install || { err "npm install failed in frontend"; exit 1; }
        log "Starting frontend (npm start)..."
        npm start &
        FRONTEND_PID=$!
        cleanup_pids+=("$FRONTEND_PID")
        cd "$SCRIPT_DIR"
    else
        err "frontend directory not found"
    fi

    log "Local servers launched. Backend: http://localhost:4000  Frontend: http://localhost:3000"
    log "Press Ctrl+C to stop." 
    # wait until killed
    wait
}

### Start local if Docker path not taken
ensure_nvm_and_node
install_and_start_local

