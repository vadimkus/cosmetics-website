#!/bin/bash

# E2E Test Execution Script
# Runs all Playwright tests and generates detailed reports

echo "========================================="
echo "🧪 E2E Test Execution Report"
echo "========================================="
echo ""
echo "Project: Cosmetics Website"
echo "Date: $(date)"
echo "Test Framework: Playwright"
echo ""
echo "========================================="
echo ""

# Check if dev server is running
echo "✓ Checking dev server..."
if ps aux | grep -v grep | grep "next dev" > /dev/null; then
    echo "  ✅ Dev server is running"
else
    echo "  ❌ Dev server is NOT running"
    echo "  Please start dev server: npm run dev"
    exit 1
fi

echo ""
echo "========================================="
echo "📋 TEST SUITE 1: Authentication Flow"
echo "========================================="
npx playwright test e2e/auth.spec.ts --reporter=list
AUTH_RESULT=$?

echo ""
echo "========================================="
echo "📋 TEST SUITE 2: COD Checkout Flow"
echo "========================================="
npx playwright test e2e/checkout-cod.spec.ts --reporter=list
COD_RESULT=$?

echo ""
echo "========================================="
echo "📋 TEST SUITE 3: Stripe Checkout Flow"
echo "========================================="
npx playwright test e2e/checkout-stripe.spec.ts --reporter=list
STRIPE_RESULT=$?

echo ""
echo "========================================="
echo "📋 TEST SUITE 4: Profile Management"
echo "========================================="
npx playwright test e2e/profile.spec.ts --reporter=list
PROFILE_RESULT=$?

echo ""
echo "========================================="
echo "📋 TEST SUITE 5: Admin Order Management"
echo "========================================="
npx playwright test e2e/admin-orders.spec.ts --reporter=list
ADMIN_RESULT=$?

echo ""
echo "========================================="
echo "📊 FINAL RESULTS SUMMARY"
echo "========================================="
echo ""

# Count results
TOTAL=5
PASSED=0

[[ $AUTH_RESULT -eq 0 ]] && ((PASSED++)) && echo "✅ Authentication Tests: PASSED" || echo "❌ Authentication Tests: FAILED"
[[ $COD_RESULT -eq 0 ]] && ((PASSED++)) && echo "✅ COD Checkout Tests: PASSED" || echo "❌ COD Checkout Tests: FAILED"
[[ $STRIPE_RESULT -eq 0 ]] && ((PASSED++)) && echo "✅ Stripe Checkout Tests: PASSED" || echo "❌ Stripe Checkout Tests: FAILED"
[[ $PROFILE_RESULT -eq 0 ]] && ((PASSED++)) && echo "✅ Profile Management Tests: PASSED" || echo "❌ Profile Management Tests: FAILED"
[[ $ADMIN_RESULT -eq 0 ]] && ((PASSED++)) && echo "✅ Admin Order Tests: PASSED" || echo "❌ Admin Order Tests: FAILED"

echo ""
echo "========================================="
echo "📈 Test Coverage: $PASSED/$TOTAL suites passed"
echo "========================================="
echo ""

# Generate HTML report
echo "📄 Generating HTML report..."
npx playwright show-report --host 127.0.0.1 &

echo ""
echo "✅ Test execution complete!"
echo "   View detailed report at: playwright-report/index.html"
echo ""

# Exit with error if any tests failed
[[ $PASSED -eq $TOTAL ]] && exit 0 || exit 1

