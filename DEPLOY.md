# Deploy & Redeploy (Fork / Bare Metal VPS)

Guide for hosting this LearnHouse fork on a VPS **without** the official CLI (which pulls upstream images). Build the image from this repo, then run Docker Compose.

This guide targets a **bare public IP over HTTP** (no domain / no SSL). When you add a domain later, switch URLs to `https://` and use Caddy or Certbot.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Linux VPS | Ubuntu 20.04+ / Debian 11+ recommended |
| Docker Engine 20.10+ | `curl -fsSL https://get.docker.com \| sh` |
| Docker Compose v2 | Bundled with modern Docker |
| RAM | **4 GB+** to build on the VPS; **2 GB** needs swap or off-box builds |
| Disk | 20 GB+ recommended |
| Ports | **80** open (firewall + cloud security group) |

```bash
docker --version
docker compose version
free -h
```

### Low-RAM VPS (2 GB) — add swap before building

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

Without enough memory, `bun run build` / `next build` dies with `SIGKILL` (OOM).

---

## Layout

| Path | Purpose |
|------|---------|
| `/opt/learnhouse` | Git clone of this fork (source + Dockerfile) |
| `/opt/learnhouse-deploy` | Compose, `.env`, nginx config (runtime) |

Keep source and deploy config separate so `git pull` does not overwrite secrets.

---

## First deploy

### 1. Clone and build the image

```bash
sudo mkdir -p /opt/learnhouse
sudo chown -R $USER:$USER /opt/learnhouse
git clone <YOUR_FORK_URL> /opt/learnhouse
cd /opt/learnhouse

# OSS build (strips apps/api/ee). Use LEARNHOUSE_PUBLIC=false if you need EE.
docker build \
  --build-arg LEARNHOUSE_PUBLIC=true \
  -t learnhouse-app:local \
  -f Dockerfile \
  .
```

Confirm:

```bash
docker images | grep learnhouse-app
```

### 2. Create deploy directory

```bash
sudo mkdir -p /opt/learnhouse-deploy/extra
sudo chown -R $USER:$USER /opt/learnhouse-deploy
cd /opt/learnhouse-deploy
```

Free port 80 if something else owns it:

```bash
sudo ss -tulpn | grep ':80'
sudo systemctl stop nginx apache2 2>/dev/null || true
sudo ufw allow 80/tcp
```

### 3. `docker-compose.yml`

Create `/opt/learnhouse-deploy/docker-compose.yml`:

```yaml
name: learnhouse

services:
  learnhouse-app:
    image: learnhouse-app:local
    container_name: learnhouse-app
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOSTNAME=0.0.0.0
      - LEARNHOUSE_API_URL=http://localhost:9000
    volumes:
      - learnhouse_content:/app/api/content
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - learnhouse-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 90s

  nginx:
    image: nginx:alpine
    container_name: learnhouse-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./extra/nginx.prod.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      learnhouse-app:
        condition: service_healthy
    networks:
      - learnhouse-network

  db:
    image: pgvector/pgvector:pg16
    container_name: learnhouse-db
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-learnhouse}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB:-learnhouse}
    volumes:
      - learnhouse_db_data:/var/lib/postgresql/data
    networks:
      - learnhouse-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-learnhouse}"]
      interval: 5s
      timeout: 4s
      retries: 10

  redis:
    image: redis:7.2.3-alpine
    container_name: learnhouse-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - learnhouse_redis_data:/data
    networks:
      - learnhouse-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 4s
      retries: 10

networks:
  learnhouse-network:
    driver: bridge

volumes:
  learnhouse_db_data:
  learnhouse_redis_data:
  learnhouse_content:
```

### 4. Nginx proxy

Create `/opt/learnhouse-deploy/extra/nginx.prod.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;
    client_max_body_size 6G;
    large_client_header_buffers 4 32k;
    client_body_buffer_size 32k;
    client_header_buffer_size 32k;

    # Outer proxy: all paths (including /landing, /api/v1, /collab) go to the
    # app container. Internal nginx in the image routes /landing → port 8010.
    location / {
        proxy_pass http://learnhouse-app:80;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        proxy_connect_timeout 75s;
    }
}
```

After deploy, the marketing site is at `http://YOUR_IP/landing`.

### 5. Environment file

Generate secrets:

```bash
openssl rand -base64 32   # NEXTAUTH_SECRET
openssl rand -base64 32   # LEARNHOUSE_AUTH_JWT_SECRET_KEY
openssl rand -base64 32   # COLLAB_INTERNAL_KEY
openssl rand -base64 24   # POSTGRES_PASSWORD
```

Create `/opt/learnhouse-deploy/.env` (replace `YOUR_IP` and secrets):

```env
LEARNHOUSE_DOMAIN=YOUR_IP
HTTP_PORT=80

NEXT_PUBLIC_LEARNHOUSE_API_URL=http://YOUR_IP/api/v1/
NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL=http://YOUR_IP/
NEXT_PUBLIC_LEARNHOUSE_DOMAIN=YOUR_IP
NEXT_PUBLIC_LEARNHOUSE_TOP_DOMAIN=YOUR_IP
NEXT_PUBLIC_LEARNHOUSE_MULTI_ORG=False
NEXT_PUBLIC_LEARNHOUSE_DEFAULT_ORG=default
NEXT_PUBLIC_LEARNHOUSE_HTTPS=False

NEXTAUTH_URL=http://YOUR_IP
NEXTAUTH_SECRET=PASTE_SECRET_1

LEARNHOUSE_SQL_CONNECTION_STRING=postgresql://learnhouse:PASTE_DB_PASSWORD@db:5432/learnhouse
LEARNHOUSE_REDIS_CONNECTION_STRING=redis://redis:6379/learnhouse
LEARNHOUSE_COOKIE_DOMAIN=
LEARNHOUSE_PORT=9000
LEARNHOUSE_TENANCY=single
LEARNHOUSE_ALLOWED_ORIGINS=http://YOUR_IP
LEARNHOUSE_DEVELOPMENT_MODE=False
LEARNHOUSE_IS_AI_ENABLED=False
LEARNHOUSE_CONTENT_DELIVERY_TYPE=filesystem
LEARNHOUSE_LOGFIRE_ENABLED=False

LEARNHOUSE_AUTH_JWT_SECRET_KEY=PASTE_SECRET_2
LEARNHOUSE_INITIAL_ADMIN_EMAIL=admin@your-real-email.com
LEARNHOUSE_INITIAL_ADMIN_PASSWORD=ChangeMeStrongPassword123
LEARNHOUSE_INITIAL_ORG_NAME=My School
LEARNHOUSE_INITIAL_ORG_SLUG=default

COLLAB_INTERNAL_KEY=PASTE_SECRET_3
LEARNHOUSE_REDIS_URL=redis://redis:6379
NEXT_PUBLIC_COLLAB_URL=ws://YOUR_IP/collab

POSTGRES_USER=learnhouse
POSTGRES_PASSWORD=PASTE_DB_PASSWORD
POSTGRES_DB=learnhouse
```

```bash
chmod 600 /opt/learnhouse-deploy/.env
```

Notes:

- Use the **same** password in `POSTGRES_PASSWORD` and `LEARNHOUSE_SQL_CONNECTION_STRING`.
- Hostnames `db` and `redis` are Docker service names (not `localhost`).
- For bare IP, leave `LEARNHOUSE_COOKIE_DOMAIN` empty.
- Admin email must use a real domain (avoid `@example.com` — seeding may skip the admin).
- `LEARNHOUSE_INITIAL_ADMIN_*` apply **only on first install**. Changing them later does not update the DB user.

### 6. Start

```bash
cd /opt/learnhouse-deploy
docker compose up -d
docker compose ps
docker compose logs -f learnhouse-app
```

First boot can take 1–2 minutes. When healthy:

```bash
docker exec learnhouse-app curl -sf http://localhost/api/v1/health && echo OK
curl -sf http://YOUR_IP/api/v1/health && echo OK
```

Open **`http://YOUR_IP`**, log in with the initial admin credentials, then change the password in Account settings.

---

## Redeploy (code updates)

Use this after you push changes to the fork and want the VPS to run the new build. **Does not wipe the database** if you avoid `-v`.

```bash
# 1. Optional: backup DB first
docker exec learnhouse-db pg_dump -U learnhouse learnhouse \
  > /opt/learnhouse-deploy/backup-$(date +%F-%H%M).sql

# 2. Pull latest source
cd /opt/learnhouse
git pull

# 3. Rebuild image
docker build \
  --build-arg LEARNHOUSE_PUBLIC=true \
  -t learnhouse-app:local \
  -f Dockerfile \
  .

# 4. Recreate only the app container (keeps DB / Redis / uploads)
cd /opt/learnhouse-deploy
docker compose up -d --force-recreate learnhouse-app

# 5. Verify
docker compose ps
curl -sf http://YOUR_IP/api/v1/health && echo OK
```

### Redeploy after `.env` changes

```bash
cd /opt/learnhouse-deploy
# edit .env, then:
docker compose up -d --force-recreate learnhouse-app
```

If nginx config changed:

```bash
docker compose up -d --force-recreate nginx
```

### Full stack restart (no data loss)

```bash
cd /opt/learnhouse-deploy
docker compose down
docker compose up -d
```

### Nuclear reset (DESTROYS database and uploads)

```bash
cd /opt/learnhouse-deploy
docker compose down -v
docker compose up -d
```

Only use `-v` when you intentionally want a fresh install. Initial admin env vars will seed again.

---

## Day-2 commands

```bash
cd /opt/learnhouse-deploy

docker compose ps                 # status
docker compose logs -f            # all logs
docker compose logs -f learnhouse-app
docker compose restart learnhouse-app
docker compose stop
docker compose start
```

### Database backup / restore

```bash
# Backup
docker exec learnhouse-db pg_dump -U learnhouse learnhouse \
  > /opt/learnhouse-deploy/backup-$(date +%F).sql

# Restore (overwrites current DB)
cat /opt/learnhouse-deploy/backup-YYYY-MM-DD.sql \
  | docker exec -i learnhouse-db psql -U learnhouse -d learnhouse
```

### Change admin password / email

- **If you can log in:** Account → Security (password), Account → General (email).
- **Do not** expect editing `LEARNHOUSE_INITIAL_ADMIN_*` in `.env` to update an existing user.
- **If locked out:** reset via SQL (hash password inside the app container, then `UPDATE` the user row). See project docs / ops notes for hash helper:

```bash
docker exec -it learnhouse-app bash -c 'cd /app/api && uv run python -c "
from src.security.security import security_hash_password
print(security_hash_password(\"YourNewStrongPassword123\"))
"'
```

---

## Troubleshooting

| Symptom | What to try |
|---------|-------------|
| Build killed / exit 139 / SIGKILL | OOM — add swap or build on a larger machine and `docker load` the image |
| Port 80 already allocated | Stop host nginx/apache; `docker compose up -d` |
| App never healthy | Check `docker compose logs learnhouse-app` and DB password match in `.env` |
| Browser cannot connect | Open TCP 80 on `ufw` **and** cloud firewall / security group |
| HTTPS / cert errors | Expected on bare IP — this setup is HTTP only |
| Login fails after email change | Use the new email; password unchanged unless you reset it |

```bash
docker compose ps
docker compose logs --tail=150 learnhouse-app
docker compose logs --tail=50 db
docker compose logs --tail=50 nginx
```

---

## Optional: build elsewhere, run on VPS

If the VPS cannot build (RAM):

```bash
# On a machine with 8 GB+ RAM
docker build --build-arg LEARNHOUSE_PUBLIC=true -t learnhouse-app:local -f Dockerfile .
docker save learnhouse-app:local | gzip > learnhouse-app.tar.gz

# Copy to VPS, then:
gunzip -c learnhouse-app.tar.gz | docker load
cd /opt/learnhouse-deploy
docker compose up -d --force-recreate learnhouse-app
```

---

## Checklist

### First deploy

- [ ] Docker + Compose installed
- [ ] Enough RAM or swap for build
- [ ] Image `learnhouse-app:local` built
- [ ] `/opt/learnhouse-deploy` with compose, nginx, `.env`
- [ ] Port 80 free and allowed
- [ ] `docker compose up -d` healthy
- [ ] Open `http://YOUR_IP/` (app) and `http://YOUR_IP/landing` (marketing)
- [ ] `http://YOUR_IP` loads; admin login works; password changed

### Redeploy

- [ ] DB backup taken (recommended)
- [ ] `git pull` + `docker build`
- [ ] `docker compose up -d --force-recreate learnhouse-app`
- [ ] Health check OK
- [ ] Spot-check login and a course page
