@echo off
setlocal

cd /d "%~dp0host"

if exist dist\src\native.js (
  node dist\src\native.js
  exit /b %errorlevel%
)

if exist node_modules\tsx\dist\cli.mjs (
  node node_modules\tsx\dist\cli.mjs src\native.ts
  exit /b %errorlevel%
)

exit /b 1
