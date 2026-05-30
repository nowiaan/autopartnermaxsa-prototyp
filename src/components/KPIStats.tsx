import React from "react";
import { TrendingUp, Clock, Percent, ThumbsUp, AlertCircle, Award } from "lucide-react";
import { MetricSummary } from "../types";

interface KPIStatsProps {
  metrics: MetricSummary;
  isPilotActive: boolean;
}

export const KPIStats: React.FC<KPIStatsProps> = ({ metrics, isPilotActive }) => {
  return (
    <div className="space-y-2 mb-4">
      {/* Simulation disclaimer label */}
      <div className="bg-amber-50/70 border border-amber-200/50 rounded-lg p-2 px-3 flex items-center gap-2 text-amber-800 text-[10px]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-ping"></span>
        <span>
          <strong>ℹ️ Dane demonstracyjne:</strong> Wszystkie wskaźniki KPI w niniejszym prototypie są symulacją pokazującą metodologię pomiaru i korzyści biznesowe wdrożenia pilotażowego.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Average preparation time */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4.5 hover:border-[#3b82f6] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] transition duration-200">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Śr. czas oferty
          </span>
          <div className="p-1 px-1.5 bg-[#ecfdf5] rounded text-[10px] text-[#059669] font-bold flex items-center gap-0.5 border border-[#a7f3d0]">
            <TrendingUp size={11} /> -{metrics.savedTimePercent}%
          </div>
        </div>
        <div className="text-2xl font-black text-[#1e293b] mt-2 font-mono tracking-tight">
          {Math.floor(metrics.avgQuotingTimeSec / 60)}m {metrics.avgQuotingTimeSec % 60}s
        </div>
        <p className="text-[10px] text-[#64748b] mt-1 font-medium">
          Wobec 18 min przed wdrożeniem AI
        </p>
      </div>

      {/* Assistant Adoption */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4.5 hover:border-[#3b82f6] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] transition duration-200">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Adopcja Asystenta
          </span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
        </div>
        <div className="text-2xl font-black text-[#1e293b] mt-2 font-mono tracking-tight">
          {metrics.adoptionRate}%
        </div>
        <p className="text-[10px] text-[#64748b] mt-1 font-medium">
          26 z 34 ofert wygenerowano z AI
        </p>
      </div>

      {/* Margin security safety ok rate */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4.5 hover:border-[#3b82f6] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] transition duration-200">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Akceptacja Cenowa
          </span>
          <span className="text-[10px] font-extrabold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-1.5 rounded uppercase">Bezpieczna</span>
        </div>
        <div className="text-2xl font-black text-[#1e293b] mt-2 font-mono tracking-tight">
          {metrics.marginOkRate}%
        </div>
        <p className="text-[10px] text-[#64748b] mt-1 font-medium">
          Marża w progu bezpieczeństwa
        </p>
      </div>

      {/* Total offers prepared */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4.5 hover:border-[#3b82f6] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.02)] transition duration-200">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
            Suma ofert
          </span>
          <span className="text-[10px] text-[#64748b] font-bold uppercase border border-[#e2e8f0] px-1 rounded-sm">Dziś</span>
        </div>
        <div className="text-2xl font-black text-[#1e293b] mt-2 font-mono tracking-tight">
          {metrics.totalSentOffers}
        </div>
        <p className="text-[10px] text-[#64748b] mt-1 font-medium">
          Zrealizowane wysyłki e-mail
        </p>
      </div>

      {/* Active pilot program banner */}
      <div className="bg-[#0f172a] rounded-xl p-4.5 text-white shadow-[0_4px_20px_rgba(15,23,42,0.15)] col-span-1 md:col-span-2 lg:col-span-1 border border-slate-800 flex flex-col justify-between">
        <div className="text-[9px] font-extrabold tracking-[0.15em] text-[#94a3b8] uppercase flex items-center gap-1">
          <Award size={10} className="text-[#3b82f6]" /> Status Pilota B2B
        </div>
        <div className="text-xs font-bold mt-2 leading-none text-white">
          Aktywny · Kraków Rybitwy
        </div>
        <div className="text-[10px] text-[#94a3b8] mt-2 leading-snug font-medium">
          Weryfikacja rynkowa zintegrowanej marży dynamicznej.
        </div>
      </div>
    </div>
    </div>
  );
};
