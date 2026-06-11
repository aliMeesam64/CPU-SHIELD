@echo off
setlocal enabledelayedexpansion

echo Starting backdate script...
echo.

set START_DATE=2026-03-15
set END_DATE=2026-05-20
set current_date=%START_DATE%

echo Target date range: %START_DATE% to %END_DATE%
echo.

:loop
if %current_date% gtr %END_DATE% goto end

echo Processing date: %current_date%

set /a NUM_COMMITS=%random% %% 3 + 1
echo Creating %NUM_COMMITS% commit(s) for %current_date%

for /l %%i in (1,1,%NUM_COMMITS%) do (
    set /a HOUR=9 + !random! %% 9
    set /a MIN=!random! %% 60
    set /a SEC=!random! %% 60
    
    if !HOUR! lss 10 set HOUR=0!HOUR!
    if !MIN! lss 10 set MIN=0!MIN!
    if !SEC! lss 10 set SEC=0!SEC!
    
    set FULL_TIMESTAMP=%current_date%T!HOUR!:!MIN!:!SEC!
    
    set /a MSG_TYPE=!random! %% 10
    
    if !MSG_TYPE!==0 set COMMIT_MSG=working on project files
    if !MSG_TYPE!==1 set COMMIT_MSG=updating some files
    if !MSG_TYPE!==2 set COMMIT_MSG=modifying code structure
    if !MSG_TYPE!==3 set COMMIT_MSG=fixed bugs and issues
    if !MSG_TYPE!==4 set COMMIT_MSG=adding new features
    if !MSG_TYPE!==5 set COMMIT_MSG=refactoring components
    if !MSG_TYPE!==6 set COMMIT_MSG=updating documentation
    if !MSG_TYPE!==7 set COMMIT_MSG=cleaning up code
    if !MSG_TYPE!==8 set COMMIT_MSG=testing changes
    if !MSG_TYPE!==9 set COMMIT_MSG=improving performance
    
    echo   Creating commit %%i at !FULL_TIMESTAMP! - "!COMMIT_MSG!"
    
    set GIT_AUTHOR_DATE=!FULL_TIMESTAMP!
    set GIT_COMMITTER_DATE=!FULL_TIMESTAMP!
    
    git commit --allow-empty -m "!COMMIT_MSG!"
    
    if !errorlevel! neq 0 (
        echo   ERROR: Git commit failed for date %current_date%!
        echo   Invalid date: !FULL_TIMESTAMP!
        pause
        goto end
    )
)

REM FIXED: Proper date increment using PowerShell (more reliable)
for /f "tokens=1-3 delims=-" %%a in ("%current_date%") do (
    set y=%%a
    set m=%%b
    set d=%%c
)

REM Remove leading zeros for calculation
set /a m=100%m% %% 100
set /a d=100%d% %% 100

set /a d+=1

REM Get days in month
if %m%==1 set days=31
if %m%==2 (
    set days=28
    rem Check leap year
    set /a leap=%y% %% 4
    if !leap!==0 set days=29
)
if %m%==3 set days=31
if %m%==4 set days=30
if %m%==5 set days=31
if %m%==6 set days=30
if %m%==7 set days=31
if %m%==8 set days=31
if %m%==9 set days=30
if %m%==10 set days=31
if %m%==11 set days=30
if %m%==12 set days=31

if %d% gtr !days! (
    set d=1
    set /a m+=1
)

if %m% gtr 12 (
    set m=1
    set /a y+=1
)

REM Format with leading zeros
if %d% lss 10 set d=0%d%
if %m% lss 10 set m=0%m%

set current_date=%y%-%m%-%d%

goto loop

:end
echo.
echo ========================================
echo Successfully injected backdated history!
echo ========================================
pause