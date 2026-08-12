@echo off
echo ==================================
echo BlackLock - Android Build Script
echo ==================================
echo.

REM Set Android SDK path
set ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk

REM Add Android tools to PATH
set PATH=%ANDROID_SDK_ROOT%\platform-tools;%ANDROID_SDK_ROOT%\emulator;%PATH%

REM Check if emulator is running
echo Checking for Android devices/emulators...
adb devices

echo.
echo Starting Expo build...
echo.

npx expo run:android

pause
