#!/bin/bash

# Script to run Playwright tests 5 times
# This helps identify flaky tests and ensures consistency

echo "======================================"
echo "Running Playwright Tests 5 Times"
echo "======================================"
echo ""

PASS_COUNT=0
FAIL_COUNT=0

for i in {1..5}
do
  echo "======================================"
  echo "Test Run #$i"
  echo "======================================"
  
  if npx playwright test; then
    echo "✅ Run #$i PASSED"
    ((PASS_COUNT++))
  else
    echo "❌ Run #$i FAILED"
    ((FAIL_COUNT++))
  fi
  
  echo ""
  echo "Current Results: $PASS_COUNT Passed, $FAIL_COUNT Failed"
  echo ""
  
  # Small delay between runs
  sleep 2
done

echo ""
echo "======================================"
echo "Final Results"
echo "======================================"
echo "Total Runs: 5"
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "======================================"

if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 All test runs passed!"
  exit 0
else
  echo "⚠️ Some test runs failed. Review the results above."
  exit 1
fi
