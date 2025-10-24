# Quick Start Guide

## Local Development (npm)

```bash
# 1. Edit backend/.env with your credentials

# 2. Start application
./start-local.sh

# 3. Stop application
./stop-local.sh
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Docker/Podman Deployment

```bash
# 1. Create .env file in root with all variables

# 2. Build and run
./build.sh
```

**View logs:**
```bash
podman logs -f team-management
```

**Stop:**
```bash
podman stop team-management
podman rm team-management
```

---

## Cleanup

```bash
./cleanup.sh  # Removes node_modules, build artifacts, logs
```

---

## Prerequisites

- Node.js 18+
- MongoDB running (localhost:27017 or external)
- Ollama running (optional, for AI features)
- SMTP credentials (optional, for emails)

---

## Scripts

| Script | Purpose |
|--------|---------|
| `setup-local.sh` | Create .env files and logs directory |
| `start-local.sh` | Start frontend + backend with npm |
| `stop-local.sh` | Stop both services |
| `build.sh` | Build and run with Podman |
| `cleanup.sh` | Clean all build artifacts |

---

**Logs:**
- Backend: `tail -f logs/backend.log`
- Frontend: `tail -f logs/frontend.log`