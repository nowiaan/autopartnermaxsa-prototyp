import React from "react";
import { Mail, Clock, ShieldAlert, PlusCircle, Check, Compass, Folder, Server } from "lucide-react";
import { Inquiry } from "../types";

interface SidebarProps {
  inquiries: Inquiry[];
  activeInquiryId: string;
  onSelectInquiry: (id: string) => void;
  onAddCustomInquiry: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  inquiries,
  activeInquiryId,
  onSelectInquiry,
  onAddCustomInquiry
}) => {
  return (
    <aside className="bg-white border-r border-[#e2e8f0] p-5 flex flex-col h-full overflow-y-auto select-none font-sans">
      
      {/* Active Mailbox Sync Status widget */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Poczta zintegrowana (IMAP)
        </div>
        <p className="text-[10px] text-emerald-700 mt-1 leading-normal">
          Wiadomości e-mail ze skrzynki B2B są pobierane i analizowane w czasie rzeczywistym. Handlowiec nie musi przeklejać żadnych danych!
        </p>
      </div>

      {/* Sidebar Section: Main List */}
      <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.1em] mb-4">
        Zsynchronizowana Skrzynka
      </div>

      <p className="text-xs text-[#64748b] mb-4 leading-relaxed">
        Wybierz zintegrowany e-mail klienta, aby automatycznie uruchomić analizę marży i zamienników TecDoc.
      </p>

      {/* Inquiries list styled as geometric navigation items */}
      <div className="flex-1 space-y-2 mt-1">
        {inquiries.map((inq) => {
          const isActive = inq.id === activeInquiryId;
          return (
            <div
              key={inq.id}
              onClick={() => onSelectInquiry(inq.id)}
              className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer group flex flex-col gap-1.5
                ${
                  isActive
                    ? "bg-[#eff6ff] border-[#3b82f6] shadow-xs"
                    : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1]"
                }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`font-semibold text-xs truncate max-w-[140px] transition-colors
                    ${isActive ? "text-[#3b82f6]" : "text-[#1e293b]"}`}
                >
                  {inq.clientName}
                </span>
                <span className="text-[10px] text-[#64748b] flex items-center gap-0.5 whitespace-nowrap font-mono">
                  <Clock size={10} className="text-[#94a3b8]" />
                  {inq.time}
                </span>
              </div>
              
              <div className="text-[11px] font-bold text-[#1e293b] truncate">
                {inq.companyName}
              </div>

              <div className="text-[11px] text-[#64748b] truncate group-hover:text-[#1e293b] leading-tight transition-colors">
                {inq.subject}
              </div>

              <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#f1f5f9]">
                <div className="flex gap-1">
                  {inq.tags.slice(0, 1).map((tg, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-semibold text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
                <span
                  className={`text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full border
                    ${
                      inq.status === "new"
                        ? "bg-[#fef3c7] text-[#d97706] border-[#fde68a]"
                        : inq.status === "draft"
                        ? "bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]"
                        : "bg-[#d1fae5] text-[#059669] border-[#a7f3d0]"
                    }`}
                >
                  {inq.status === "new"
                    ? "Nowe"
                    : inq.status === "draft"
                    ? "Draft"
                    : "Wysłane"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Categories layout section representing the system categories in Design HTML */}
      <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
        <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-[0.1em] mb-3">
          Statusy i kategorie
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-[#64748b] hover:text-[#1e293b] duration-150 cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span> Analityka marży
            </span>
            <span className="font-mono text-[10px] bg-[#f8fafc] border border-[#e2e8f0] px-1 rounded">12</span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#64748b] hover:text-[#1e293b] duration-150 cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> Kompletne wyceny
            </span>
            <span className="font-mono text-[10px] bg-[#f8fafc] border border-[#e2e8f0] px-1 rounded">8</span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#64748b] hover:text-[#1e293b] duration-150 cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]"></span> Oczekujące na VIN
            </span>
            <span className="font-mono text-[10px] bg-[#f8fafc] border border-[#e2e8f0] px-1 rounded">5</span>
          </div>
        </div>
      </div>

      {/* Quick Action to upload or write manual inquiries */}
      <div className="p-1 border-t border-[#e2e8f0] mt-5 pt-4 space-y-2">
        <button
          onClick={onAddCustomInquiry}
          className="w-full py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Mail size={14} />
          Symuluj nowy e-mail (IMAP)
        </button>
        <p className="text-[10px] text-[#64748b] text-center leading-normal">
          Dla celów deweloperskich/prezentacji: zasymuluj nadejście maila na wspólną skrzynkę Handlowca.
        </p>
      </div>
    </aside>
  );
};
