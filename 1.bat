@echo off
cd /d "%~dp0assets"
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed.
    cscript //nologo node-e.vbs
) else (
    echo Node.js detected.
    call framesecond.bat
)
