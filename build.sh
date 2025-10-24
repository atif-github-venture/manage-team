#!/bin/bash
# Build and deploy script for Team Management application using Podman
# Stop and remove container if running
podman stop team-management 2>/dev/null
podman rm team-management 2>/dev/null

# Remove existing image
podman rmi team-management 2>/dev/null

# Rebuild image
podman build -t team-management .

# Run container
podman run -d \
  --name team-management \
  -p 3000:3000 \
  -p 5000:5000 \
  --env-file .env \
  team-management