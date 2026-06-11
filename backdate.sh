@echo off
setlocal enabledelayedexpansion

set START_DATE=2026-03-15
set END_DATE=2026-05-20
set current_date=%START_DATE%

:loop
if %current_date% gtr %END_DATE% goto end

set /a NUM_COMMITS=%random% %% 3 + 1

for /l %%i in (1,1,%NUM_COMMITS%) do (
    set /a HOUR=9 + !random! %% 9
    set /a MIN=!random! %% 60
    set /a SEC=!random! %% 60
    
    if !HOUR! lss 10 set HOUR=0!HOUR!
    if !MIN! lss 10 set MIN=0!MIN!
    if !SEC! lss 10 set SEC=0!SEC!
    
    set FULL_TIMESTAMP=%current_date%T!HOUR!:!MIN!:!SEC!
    
    set GIT_AUTHOR_DATE=!FULL_TIMESTAMP!
    set GIT_COMMITTER_DATE=!FULL_TIMESTAMP!
    
    git commit --allow-empty -m "Refactor historical modules on %current_date% (Commit #%%i)"
)

REM Simple date increment (works for same month)
for /f "tokens=1-3 delims=-" %%a in ("%current_date%") do (
    set /a year=%%a
    set /a month=%%b
    set /a day=%%c
)
set /a day+=1
if %day% lss 10 set day=0%day%
set current_date=%year%-%month%-%day%

goto loop

:end
echo Successfully injected backdated history!
pause