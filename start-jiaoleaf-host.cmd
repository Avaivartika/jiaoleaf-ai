@echo off
setlocal

cd /d "%~dp0host"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required.
  echo Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing JiaoLeaf host dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting JiaoLeaf host on http://127.0.0.1:3210
echo Keep this window open while using the extension.
echo If you use Codex with a ChatGPT account, run login-codex.cmd once first.
call npm run dev
pause
