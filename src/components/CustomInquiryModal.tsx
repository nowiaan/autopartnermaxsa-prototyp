import React, { useState } from "react";
import { Mail, Sparkles, X, AlertTriangle } from "lucide-react";

interface CustomInquiryModalProps {
  onClose: () => void;
  onSubmit: (clientName: string, companyName: string, email: string, text: string) => void;
}

export const CustomInquiryModal: React.FC<CustomInquiryModalProps> = ({ onClose, onSubmit }) => {
  const [clientName, setClientName] = useState("Krzysztof Górnik");
  const [companyName, setCompanyName] = useState("Górnik Auto Service");
  const [email, setEmail] = useState("gornik.serwis@poczta.pl");
  const [body, setBody] = useState(`Witam,
Potrzebuję od ręki klocki i tarcze hamulcowe przód pakiety do Opel Astra J z 2014 roku, wersja silnikowa 1.7 CDTI. 
Proszę sprawdzić czy macie producenta TRW albo Textar i jaka jest cena. Auto czeka na warsztacie od rana. Dajcie znać o statusie.
Pozdrawiam, Krzysztof.`);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !clientName.trim()) return;
    onSubmit(clientName, companyName, email, body);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0f172a] p-4 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="text-[#3b82f6]" size={18} />
            <span className="font-bold text-sm tracking-wide">Symulator Integracji Skrzynki (IMAP/API)</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Architecture integration explanation banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3.5 space-y-1">
            <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              ✨ Architektura Zintegrowana (Bez przeklejania)
            </h5>
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              <strong>Pracownik nie przekleja niczego.</strong> W produkcyjnym wdrożeniu ten system działa w tle i nasłuchuje Twojej prawdziwej skrzynki e-mail (Outlook/Gmail). Gdy klient wyśle zapytanie, system automatycznie wyłapie go w tle.
            </p>
            <p className="text-[10px] text-emerald-700 leading-relaxed mt-1">
              Poniższy formularz służy wyłącznie do <strong>zasymulowania nadania e-maila</strong> przez klienta B2B, aby zobaczyć jak system odbierze go bez udziału rąk handlowca.
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-1">
              Wysyłanie e-maila jako klient (Symulacja nadawcy)
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1">
                  Klient (Imię i Nazwisko)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-lg text-xs focus:ring-2 focus:ring-[#3b82f6] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1">
                  Nazwa Warsztatu
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-lg text-xs focus:ring-2 focus:ring-[#3b82f6] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1">
                Adres e-mail nadawcy
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-lg text-xs focus:ring-2 focus:ring-[#3b82f6] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1">
                Treść wiadomości (zapytanie o części)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-lg text-xs focus:ring-2 focus:ring-[#3b82f6] outline-none font-sans leading-relaxed resize-none"
                placeholder="Np. Potrzebuję pilnie cewki do..."
              />
            </div>
          </div>

          <div className="bg-[#eff6ff] border border-[#dbeafe] p-2.5 rounded-lg flex gap-2 items-start">
            <Sparkles className="text-[#3b82f6] flex-shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-[#1e40af] leading-normal">
              Po zatwierdzeniu wyślemy ten e-mail bezpośrednio na serwer. <strong>Asystent AI natychmiast go przetworzy w tle</strong>, wyodrębni części i dopasuje produkty z katalogu.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              Symuluj i Odbierz E-mail
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
