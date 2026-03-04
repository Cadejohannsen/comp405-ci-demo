@echo off
title CarCompare - Starting...
cd /d "x:\Comp405\New folder\car-compare"

:: Check if server is already running on port 3000
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel%==0 (
    echo Server already running. Opening browser...
    start http://localhost:3000
    exit
)

echo Starting CarCompare...
start /min cmd /c "cd /d x:\Comp405\New folder\car-compare && npm run dev"

:: Wait for server to start
echo Waiting for server to start...
:wait
timeout /t 2 /nobreak >nul
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% neq 0 goto wait

echo Server ready! Opening browser...
start http://localhost:3000
exit
