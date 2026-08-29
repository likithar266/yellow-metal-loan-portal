"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Hash, Coin } from "@phosphor-icons/react";

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

interface Lead {
  _id: string;
  customerName: string;
  mobileNumber: string;
  netWeightGrams: number;
  purityKarat: number;
  selectedPlanId: string;
  calculatedMaxEligibleLoan: number;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("http://localhost:5000/api/v1/leads");
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const maskMobile = (num: string) => {
    if (!num || num.length < 10) return num;
    return `${num.slice(0, 4)}XXXX${num.slice(-2)}`;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#09090b] text-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8 w-full flex-grow">
        
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <YellowMetalLogo className="w-10 h-10 shadow-lg rounded-full" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
              <p className="text-sm text-zinc-400">View and manage collected loan leads</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md text-sm font-medium">
            <span className="text-brand">{leads.length}</span> Total Leads
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-zinc-900 rounded-md border border-zinc-800 w-full" />
            <div className="h-16 bg-zinc-900 rounded-md border border-zinc-800 w-full" />
            <div className="h-16 bg-zinc-900 rounded-md border border-zinc-800 w-full" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Collateral (Net)</th>
                    <th className="px-6 py-4 font-medium">Plan Selected</th>
                    <th className="px-6 py-4 font-medium text-right">Eligible Loan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <User weight="bold" />
                          </div>
                          <span className="font-semibold text-zinc-200">{lead.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-400 font-mono tracking-wide">
                          {maskMobile(lead.mobileNumber)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-medium">
                          {lead.netWeightGrams}g ({lead.purityKarat}K)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-zinc-300 font-medium">{lead.selectedPlanId === "PLAN_BULLET_01" ? "Bullet Repayment" : "Monthly EMI"}</span>
                          <span className="text-xs text-zinc-500">ID: {lead.selectedPlanId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-brand font-bold text-base">
                          ₹{Math.floor(lead.calculatedMaxEligibleLoan).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No leads collected yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full max-w-6xl mx-auto text-center text-zinc-600 text-xs font-medium pt-8 mt-12 border-t border-zinc-800/50">
        &copy; {new Date().getFullYear()} Yellow Metal NBFC. All rights reserved. <span className="mx-2">•</span> Admin Portal
      </footer>
    </div>
  );
}
