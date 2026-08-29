"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretRight, Info, CheckCircle } from "@phosphor-icons/react";

const YellowMetalLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="50" fill="#18181B" />
    <g stroke="#EAB308" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M 28 35 L 45 45 L 45 75" />
      <path d="M 72 35 L 55 45 L 55 75" />
      <path d="M 28 48 L 40 55" />
      <path d="M 72 48 L 60 55" />
    </g>
  </svg>
);

const LOAN_SCHEMES = [
  {
    id: "PLAN_BULLET_01",
    name: "Bullet Repayment",
    baseInterestRate: 9.5,
    maxLtvCap: 75,
    description: "Pay interest and principal at the end of tenure.",
  },
  {
    id: "PLAN_EMI_01",
    name: "Monthly EMI",
    baseInterestRate: 11.0,
    maxLtvCap: 75,
    description: "Pay in equal monthly installments.",
  },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    grossWeightGrams: "",
    netWeightGrams: "",
    purityKarat: 22,
    selectedPlanId: "",
  });

  const [pureGoldWeight, setPureGoldWeight] = useState(0);
  const [eligibleLoan, setEligibleLoan] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState("");
  const [error, setError] = useState("");

  // Dynamically calculate based on inputs
  useEffect(() => {
    const netWeight = parseFloat(formData.netWeightGrams) || 0;
    const grossWeight = parseFloat(formData.grossWeightGrams) || 0;
    const purity = formData.purityKarat;
    
    if (netWeight > 0 && netWeight <= grossWeight) {
      const pure = netWeight * (purity / 24);
      setPureGoldWeight(pure);
      
      const plan = LOAN_SCHEMES.find((p) => p.id === formData.selectedPlanId);
      const ltv = plan ? plan.maxLtvCap / 100 : 0.75; // default 75%
      
      const GOLD_PRICE_PER_GRAM = 7000;
      setEligibleLoan(pure * GOLD_PRICE_PER_GRAM * ltv);
    } else {
      setPureGoldWeight(0);
      setEligibleLoan(0);
    }
  }, [formData]);

  const handleNext = () => {
    setError("");
    if (!formData.customerName) return setError("Name is required.");
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) return setError("Valid 10-digit mobile number required.");
    const net = parseFloat(formData.netWeightGrams);
    const gross = parseFloat(formData.grossWeightGrams);
    if (!gross || gross <= 0) return setError("Enter valid gross weight.");
    if (!net || net <= 0) return setError("Enter valid net weight.");
    if (net > gross) return setError("Net weight cannot exceed gross weight.");
    
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.selectedPlanId) return setError("Please select a loan scheme.");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          grossWeightGrams: parseFloat(formData.grossWeightGrams),
          netWeightGrams: parseFloat(formData.netWeightGrams),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccessId(data.applicationId);
      setStep(3);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex flex-col md:flex-row relative overflow-hidden bg-[#09090b]">
      {/* Left Branding Panel */}
      <div className="w-full md:w-5/12 lg:w-1/3 border-r border-zinc-800 p-8 md:p-12 flex flex-col justify-between relative z-10 overflow-hidden bg-zinc-900">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_rgba(234,179,8,0.08)_0%,_transparent_50%)] pointer-events-none" />
        <YellowMetalLogo className="absolute -bottom-24 -left-24 w-96 h-96 opacity-[0.03] pointer-events-none rotate-12" />

        <div className="space-y-8 relative">
          <div className="flex items-center gap-3 text-zinc-50 font-extrabold text-2xl tracking-tight uppercase">
            <YellowMetalLogo className="w-10 h-10 shadow-brand/20 drop-shadow-md rounded-full" />
            Yellow Metal
          </div>
          <div className="space-y-4">
            <p className="text-zinc-300 text-base md:text-lg font-medium leading-relaxed max-w-sm">
              Unlock the value of your gold instantly.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              We are an RBI Licensed NBFC offering preliminary gold loan estimates strictly based on pure gold content and live market rates.
            </p>
          </div>
        </div>
        
        <div className="mt-16 hidden md:block relative">
          <div className="bg-zinc-950/50 backdrop-blur-md rounded-xl p-6 border border-zinc-800/50 space-y-5 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Platform Guarantees</h3>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <CheckCircle weight="fill" className="text-emerald-500 text-sm" />
              </div>
              <div>
                <p className="text-zinc-200 text-sm font-semibold">Bank-Grade Security</p>
                <p className="text-zinc-500 text-xs mt-1">256-bit encryption for all data</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 border border-brand/20">
                <CheckCircle weight="fill" className="text-brand text-sm" />
              </div>
              <div>
                <p className="text-zinc-200 text-sm font-semibold">Maximum Loan-to-Value</p>
                <p className="text-zinc-500 text-xs mt-1">Regulatory 75% cap applied</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <CheckCircle weight="fill" className="text-blue-500 text-sm" />
              </div>
              <div>
                <p className="text-zinc-200 text-sm font-semibold">Live Market Valuation</p>
                <p className="text-zinc-500 text-xs mt-1">Rates updated daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-full md:w-7/12 lg:w-2/3 flex flex-col p-6 md:p-12 relative min-h-screen md:h-screen md:overflow-y-auto">
        <div className="flex-grow flex items-center justify-center py-12 md:py-0">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Calculate Your Loan</h1>
                  <p className="text-zinc-400 mt-2">Enter your collateral details for an instant estimate.</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Full Name</label>
                      <input
                        type="text"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="Rahul Sharma"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Mobile Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Gross Wt (g)</label>
                      <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors"
                        value={formData.grossWeightGrams}
                        onChange={(e) => setFormData({ ...formData, grossWeightGrams: e.target.value })}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Net Wt (g)</label>
                      <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors"
                        value={formData.netWeightGrams}
                        onChange={(e) => setFormData({ ...formData, netWeightGrams: e.target.value })}
                        placeholder="45"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Purity</label>
                      <select
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors appearance-none"
                        value={formData.purityKarat}
                        onChange={(e) => setFormData({ ...formData, purityKarat: Number(e.target.value) })}
                      >
                        <option value={18}>18K</option>
                        <option value={22}>22K</option>
                        <option value={24}>24K</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-brand hover:bg-brand-hover text-zinc-950 font-semibold py-3 rounded-md transition-all flex items-center justify-center gap-2"
                >
                  Continue to Calculation <CaretRight weight="bold" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Select Loan Scheme</h1>
                  <p className="text-zinc-400 mt-2">Based on your pure gold weight of <strong className="text-brand">{pureGoldWeight.toFixed(2)}g</strong></p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-brand/30 bg-brand/5">
                  <div className="space-y-1 text-center md:text-left">
                    <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Max Eligible Loan</div>
                    <div className="text-4xl font-bold text-zinc-50 tracking-tight">
                      ₹{Math.floor(eligibleLoan).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                    <Info weight="bold" /> 75% LTV Applied
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {LOAN_SCHEMES.map((plan) => (
                    <label
                      key={plan.id}
                      className={`relative flex cursor-pointer rounded-xl border p-5 focus:outline-none transition-all ${
                        formData.selectedPlanId === plan.id
                          ? "border-brand bg-brand/5 ring-1 ring-brand/50"
                          : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        className="sr-only"
                        onChange={(e) => setFormData({ ...formData, selectedPlanId: e.target.value })}
                      />
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <p className="font-semibold text-zinc-100">{plan.name}</p>
                            <p className="text-zinc-400 mt-1">{plan.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand">{plan.baseInterestRate}%</p>
                          <p className="text-xs text-zinc-500 font-medium">Interest p.a.</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3 rounded-md transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-2/3 bg-brand hover:bg-brand-hover text-zinc-950 font-semibold py-3 rounded-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto border border-brand/30">
                  <CheckCircle weight="fill" className="text-brand text-4xl" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Application Submitted!</h1>
                  <p className="text-zinc-400">Your preliminary gold loan application has been recorded.</p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-sm mx-auto text-left space-y-4">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Application ID</div>
                    <div className="font-mono text-zinc-300 bg-zinc-950 px-3 py-2 rounded border border-zinc-800">{successId}</div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 flex justify-between">
                    <span className="text-sm text-zinc-400">Eligible Loan</span>
                    <span className="font-bold text-brand">₹{Math.floor(eligibleLoan).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({ ...formData, customerName: "", mobileNumber: "", netWeightGrams: "", grossWeightGrams: "", selectedPlanId: "" });
                  }}
                  className="mt-4 text-sm text-zinc-400 hover:text-brand transition-colors font-medium underline underline-offset-4"
                >
                  Submit Another Lead
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
        
        <footer className="w-full text-center text-zinc-600 text-xs font-medium pt-8 pb-4 border-t border-zinc-800/50 mt-auto">
          &copy; {new Date().getFullYear()} Yellow Metal NBFC. All rights reserved. <span className="mx-2">•</span> Terms of Service
        </footer>
      </div>
    </main>
  );
}
