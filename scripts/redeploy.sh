#!/usr/bin/env bash
# Redeploy LearnHouse on the VPS: git pull → docker build → compose recreate.
# Usage (on the server):
#   bash scripts/redeploy.sh
#   # or from anywhere:
#   bash /opt/learnhouse/scripts/redeploy.sh
#
# Env overrides (optional):
#   SRC_DIR=/opt/learnhouse
#   DEPLOY_DIR=/opt/learnhouse-deploy
#   IMAGE_TAG=learnhouse-app:local
#   LEARNHOUSE_PUBLIC=true
#   SKIP_BACKUP=1

set -euo pipefail

SRC_DIR="${SRC_DIR:-/opt/learnhouse}"
DEPLOY_DIR="${DEPLOY_DIR:-/opt/learnhouse-deploy}"
IMAGE_TAG="${IMAGE_TAG:-learnhouse-app:local}"
LEARNHOUSE_PUBLIC="${LEARNHOUSE_PUBLIC:-true}"
SKIP_BACKUP="${SKIP_BACKUP:-0}"

log() { printf '\n==> %s\n' "$*"; }

if [[ ! -d "$SRC_DIR/.git" ]]; then
  echo "ERROR: not a git repo: $SRC_DIR" >&2
  exit 1
fi
if [[ ! -f "$DEPLOY_DIR/docker-compose.yml" ]]; then
  echo "ERROR: missing compose file: $DEPLOY_DIR/docker-compose.yml" >&2
  exit 1
fi

if [[ "$SKIP_BACKUP" != "1" ]] && docker ps --format '{{.Names}}' | grep -qx 'learnhouse-db'; then
  BACKUP="$DEPLOY_DIR/backup-$(date +%F-%H%M).sql"
  log "Backing up DB → $BACKUP"
  docker exec learnhouse-db pg_dump -U learnhouse learnhouse > "$BACKUP"
fi

log "Pulling latest code in $SRC_DIR"
cd "$SRC_DIR"
git pull --ff-only

log "Building Docker image $IMAGE_TAG"
docker build \
  --build-arg "LEARNHOUSE_PUBLIC=$LEARNHOUSE_PUBLIC" \
  -t "$IMAGE_TAG" \
  -f Dockerfile \
  .

log "Recreating app container in $DEPLOY_DIR"
cd "$DEPLOY_DIR"
docker compose up -d --force-recreate learnhouse-app

log "Status"
docker compose ps

log "Health check"
if curl -sf --max-time 30 http://127.0.0.1/api/v1/health >/dev/null; then
  echo "OK — /api/v1/health"
else
  echo "WARN — health check failed; check: docker compose logs --tail=100 learnhouse-app" >&2
  exit 1
fi

log "Done"
