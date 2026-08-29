const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { loanSchemes } = require('./schemes');

const GOLD_MARKET_PRICE_PER_GRAM = 7000; // Mock rate in INR

router.post('/submit', async (req, res) => {
  try {
    const { customerName, mobileNumber, grossWeightGrams, netWeightGrams, purityKarat, selectedPlanId } = req.body;

    // 1. Input Validation
    if (!customerName || !mobileNumber || grossWeightGrams === undefined || netWeightGrams === undefined || !purityKarat || !selectedPlanId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    if (netWeightGrams > grossWeightGrams) {
      return res.status(400).json({ error: 'Net weight must be strictly less than or equal to gross weight' });
    }

    if (![18, 22, 24].includes(purityKarat)) {
      return res.status(400).json({ error: 'Invalid purity karat. Must be 18, 22, or 24' });
    }
    
    const plan = loanSchemes.find(p => p.id === selectedPlanId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid selected plan' });
    }

    // 2. Deduplication Check (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const existingLead = await Lead.findOne({
      mobileNumber,
      createdAt: { $gte: sevenDaysAgo }
    });

    if (existingLead) {
      return res.status(409).json({ error: 'A lead with this mobile number has already been submitted in the last 7 days.' });
    }

    // 3. Collateral Calculation
    const pureGoldWeight = netWeightGrams * (purityKarat / 24);
    const totalGoldMarketValue = pureGoldWeight * GOLD_MARKET_PRICE_PER_GRAM;
    const maxEligibleLoan = totalGoldMarketValue * (plan.maxLtvCap / 100);

    // 4. Save to DB
    const newLead = new Lead({
      customerName,
      mobileNumber,
      grossWeightGrams,
      netWeightGrams,
      purityKarat,
      selectedPlanId,
      calculatedPureGoldWeight: pureGoldWeight,
      calculatedMaxEligibleLoan: maxEligibleLoan,
      status: 'SUBMITTED'
    });

    await newLead.save();

    res.status(201).json({
      message: 'Lead submitted successfully',
      applicationId: newLead._id,
      pureGoldWeight,
      maxEligibleLoan
    });

  } catch (err) {
    console.error('Error submitting lead:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ leads });
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
