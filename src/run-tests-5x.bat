@echo off
REM Script to run Playwright tests 5 times on Windows
REM This helps identify flaky tests and ensures consistency

echo ======================================
echo Running Playwright Tests 5 Times
echo ======================================
echo.

set PASS_COUNT=0
set FAIL_COUNT=0

for /L %%i in (1,1,5) do (
  echo ======================================
  echo Test Run #%%i
  echo ======================================
  
  call npx playwright test
  
  if errorlevel 1 (
    echo X Run #%%i FAILED
    set /a FAIL_COUNT+=1
  ) else (
    echo √ Run #%%i PASSED
    set /a PASS_COUNT+=1
  )
  
  echo.
  echo Current Results: %PASS_COUNT% Passed, %FAIL_COUNT% Failed
  echo.
  
  REM Small delay between runs
  timeout /t 2 /nobreak >nul
)

echo.
echo ======================================
echo Final Results
echo ======================================
echo Total Runs: 5
echo Passed: %PASS_COUNT%
echo Failed: %FAIL_COUNT%
echo ======================================

if %FAIL_COUNT%==0 (
  echo All test runs passed!
  exit /b 0
) else (
  echo Some test runs failed. Review the results above.
  exit /b 1
)
