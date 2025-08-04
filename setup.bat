::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFBBfXgWEPWe/OpEZ++Pv4Pq7jUsbWOsxfYnC5YaLLOUS+UDbY8djhDoX2OgDHBJZQjO4fQogulJkv2qEO+uTtACvQ0uGhg==
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFBBfXgWEPWe/OpEZ++Pv4Pq7jUsbWOsxfYnC5YaLLOUS+UDbY8djhDoX2OgDHBJZQj2taAM9p2tEr1uTZonO/Qr5Tyg=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
cd /d "%~dp0Assets"
setlocal

if exist ".env" (
    call 1.bat
    goto :EOF
)

echo For the program to work, you need your app API key and client secret. To create an app, go to https://developer.spotify.com/dashboard/. 
echo Don't worry, we won't save this information online.

echo.
set /p CLIENT_ID=Paste your API key (Client ID): 
set /p CLIENT_SECRET=Paste your client secret: 

(
    echo SPOTIFY_CLIENT_ID=%CLIENT_ID%
    echo SPOTIFY_CLIENT_SECRET=%CLIENT_SECRET%
) > ".env"

echo.
type .env

echo.
echo Now loading
call 1.bat
pause
