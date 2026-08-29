const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  grossWeightGrams: {
    type: Number,
    required: true,
    min: 0
  },
  netWeightGrams: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v <= this.grossWeightGrams;
      },
      message: 'Net weight must be less than or equal to gross weight'
    }
  },
  purityKarat: {
    type: Number,
    required: true,
    enum: [18, 22, 24]
  },
  selectedPlanId: {
    type: String,
    required: true
  },
  calculatedPureGoldWeight: {
    type: Number,
    required: true
  },
  calculatedMaxEligibleLoan: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'SUBMITTED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
