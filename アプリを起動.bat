@echo off
rem スタバレシピマスター起動スクリプト（ダブルクリックで起動）
set "PATH=%LOCALAPPDATA%\nodejs\node-v24.18.0-win-x64;%PATH%"
cd /d "%~dp0"
echo アプリを起動しています... この黒い窓は閉じないでください。
echo （終了するときはこの窓を閉じるだけでOKです）
start "" cmd /c "timeout /t 3 >nul & start http://localhost:5173"
npm run dev
