# !/bin/bash
# Cleanup script to remove node_modules, build artifacts, and logs
echo "Starting cleanup..."
# Root cleanup
rm -rf node_modules
rm -rf package-lock.json
rm -rf dist
rm -rf .vite
rm -rf build
rm -rf logs
echo "Root cleanup done."
# Backend cleanup
cd backend
rm -rf node_modules
rm -rf package-lock.json
rm -rf logs
rm -rf .vite
rm -rf dist
echo "Backend cleanup done."
# Frontend cleanup
cd ../frontend
rm -rf node_modules
rm -rf package-lock.json
rm -rf dist
rm -rf .vite
rm -rf build
echo "Frontend cleanup done."
# Back to root
cd ..
echo "Cleanup completed."