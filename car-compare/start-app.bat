@echo off
echo Starting CarCompare...
cd /d "x:\Comp405\New folder\car-compare"

:: Start the server
start "CarCompare Server" cmd /k "npm run dev"

:: Wait a moment then open browser
timeout /t 8 /nobreak >nul
start http://localhost:3000

echo CarCompare is starting in your browser...
pause
