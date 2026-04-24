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
  echo Codex login command failed.
  echo If the message says port 127.0.0.1:1455 is already in use, another Codex login/browser auth flow is already running.
  echo Close the old Codex login browser tab or terminal, then run this file again.
  echo Do not start interactive Codex here; it can load stale MCP config and show unrelated path errors.
)
pause
