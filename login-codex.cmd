@echo off
setlocal

where npx >nul 2>nul
if errorlevel 1 (
  echo npx was not found. Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

echo Opening Codex CLI login. Use your ChatGPT/Codex account in the browser if prompted.
call npx -y @openai/codex login
if errorlevel 1 (
  echo.
  echo Codex login command failed. Starting Codex interactively as a fallback.
  call npx -y @openai/codex
)
pause
