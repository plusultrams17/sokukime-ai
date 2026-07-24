@echo off
cd /d C:\dev\sokukime-ai
echo Running Stripe product setup...
node scripts\setup-stripe-products.mjs > stripe-out.txt 2>&1
type stripe-out.txt
echo.
echo ===== DONE - output saved to stripe-out.txt =====
pause
