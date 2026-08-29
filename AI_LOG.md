# AI Audit Log

## AI Tools Used
- Google Antigravity IDE (Gemini 3.1 Pro (Low)) for full-stack rapid delivery, design implementation, and automated QA.

## Prompts Used for State & Validation
1. **Backend Validation Rules:** "Create an Express POST route at `/api/v1/leads/submit` to handle lead submission. Implement strict backend validation rules to ensure missing or invalid fields are rejected. The logic must explicitly ensure that `netWeightGrams` is strictly less than or equal to `grossWeightGrams`, the `mobileNumber` regex matches a valid 10-digit format, and `purityKarat` is either 18, 22, or 24."
2. **Frontend Form State Management:** "Build a step-by-step React form using Tailwind v4 for the Yellow Metal loan application. Use React local state to capture `customerName`, `mobileNumber`, `grossWeightGrams`, `netWeightGrams`, and `purityKarat`. Automatically calculate the eligible pure gold content in real-time when inputs change, ensuring we do not fetch schemas if previous steps are invalid."

## Flawed Code Generation & Manual Fix
**Instance:** The AI originally generated incorrect calculation logic for the eligible loan amount.
*Generated Flawed Code:* 
```javascript
const pureGoldWeight = netWeightGrams * (purityKarat / 24);
const maxEligibleLoan = pureGoldWeight * GOLD_MARKET_PRICE_PER_GRAM; // Failed to apply 75% LTV cap
```
**Audit & Fix:** 
During the audit against the assignment criteria ("Compute maximum loan eligibility using the regulatory 75% LTV cap"), I noticed the calculation ignored the `maxLtvCap` defined in the loan schemes. I manually audited and updated the logic to fetch the specific selected plan's LTV cap and multiply it correctly.

*Corrected Code:*
```javascript
const plan = loanSchemes.find(p => p.id === selectedPlanId);
const pureGoldWeight = netWeightGrams * (purityKarat / 24);
const totalGoldMarketValue = pureGoldWeight * GOLD_MARKET_PRICE_PER_GRAM;
const maxEligibleLoan = totalGoldMarketValue * (plan.maxLtvCap / 100);
```
