const express = require('express');
const router = express.Router();

const loanSchemes = [
  {
    id: 'PLAN_BULLET_01',
    name: 'Bullet Repayment Plan',
    baseInterestRate: 9.5, // 9.5% p.a.
    maxLtvCap: 75, // 75%
    description: 'Pay interest and principal at the end of the tenure.'
  },
  {
    id: 'PLAN_EMI_01',
    name: 'Monthly EMI Plan',
    baseInterestRate: 11.0, // 11.0% p.a.
    maxLtvCap: 75,
    description: 'Pay equal monthly installments.'
  }
];

router.get('/', (req, res) => {
  res.json({ schemes: loanSchemes });
});

module.exports = router;
module.exports.loanSchemes = loanSchemes;
