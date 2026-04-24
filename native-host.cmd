@echo off
setlocal

cd /d "%~dp0host"

if exist dist\src\native.js (
  if not exist "%LOCALAPPDATA%\JiaoLeafAI" mkdir "%LOCALAPPDATA%\JiaoLeafAI" >nul 2>nul
  node dist\src\native.js 2>>"%LOCALAPPDATA%\JiaoLeafAI\native-host.log"
  exit /b %errorlevel%
)

>&2 echo Missing host\dist\src\native.js. Run install-native-host.cmd again.
exit /b 1
