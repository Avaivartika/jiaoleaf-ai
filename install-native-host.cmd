@echo off
setlocal EnableExtensions

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required.
  echo Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

set /p EXTENSION_ID=Paste the JiaoLeaf AI extension ID from chrome://extensions: 
if "%EXTENSION_ID%"=="" (
  echo Extension ID is required.
  pause
  exit /b 1
)

if not exist host\node_modules (
  echo Installing host dependencies...
  pushd host
  call npm install
  if errorlevel 1 (
    popd
    echo npm install failed.
    pause
    exit /b 1
  )
  popd
)

set "MANIFEST_DIR=%LOCALAPPDATA%\JiaoLeafAI\NativeMessagingHosts"
set "MANIFEST_PATH=%MANIFEST_DIR%\com.jiaoleaf.host.json"
if not exist "%MANIFEST_DIR%" mkdir "%MANIFEST_DIR%"

node host\scripts\build-native-manifest.mjs "%EXTENSION_ID%" "%CD%\native-host.cmd" "%MANIFEST_PATH%"
if errorlevel 1 (
  echo Native manifest generation failed.
  pause
  exit /b 1
)

reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.jiaoleaf.host" /ve /t REG_SZ /d "%MANIFEST_PATH%" /f >nul
if errorlevel 1 (
  echo Chrome native host registry install failed.
  pause
  exit /b 1
)

echo.
echo Native host installed for Chrome.
echo Restart Chrome, then set Settings - Connection - Transport to Native Messaging.
echo After that Chrome can start the host in the background without a separate host terminal.
pause
