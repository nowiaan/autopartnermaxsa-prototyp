import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Coins, 
  RefreshCw, 
  Globe, 
  Sliders, 
  ChevronRight, 
  Mail, 
  PenTool, 
  RotateCcw,
  CheckCircle2,
  Trash2,
  Lock,
  LockOpen,
  Info
} from "lucide-react";

import { Inquiry, Product, Analysis, CrossSellItem, MetricSummary } from "./types";
import { initialInquiries, initialAnalyses, initialProducts, initialCrossSells } from "./data/inquiries";
import { Sidebar } from "./components/Sidebar";
import { KPIStats } from "./components/KPIStats";
import { CustomInquiryModal } from "./components/CustomInquiryModal";
import { localSimulateAnalysis, localSimulateEmail } from "./utils/simulation";

// Initial Pilot Metrics
const defaultMetrics: MetricSummary = {
  adoptionRate: 77,
  avgQuotingTimeSec: 263, // 4m 23s
  savedTimePercent: 76,
  marginOkRate: 94,
  totalSentOffers: 17
};

export default function App() {
  // Scenario lists and current selections
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [activeInquiryId, setActiveInquiryId] = useState<string>("inq_1");
  const [step, setStep] = useState<number>(1);

  // Loaded scenarios states (dynamically customizable)
  const [analyses, setAnalyses] = useState<Record<string, Analysis>>(initialAnalyses);
  const [products, setProducts] = useState<Record<string, Product[]>>(initialProducts);
  const [crossSells, setCrossSells] = useState<Record<string, CrossSellItem[]>>(initialCrossSells);
  
  // Selection and Pricing adjustments
  const [selectedProductId, setSelectedProductId] = useState<Record<string, string>>({
    inq_1: "prod_1_2", // Bosch default
    inq_2: "prod_2_2", // TRW default
    inq_3: "prod_3_1", // Knecht default
    inq_4: "prod_4_1", // SKF package default
    inq_5: "prod_5_2"  // Textar pads default
  });

  const [targetMargin, setTargetMargin] = useState<number>(20); // adjustable threshold %

  // Custom sales parameter note
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({
    inq_1: "",
    inq_2: "Przy zakupie całego kompletu dodaj 5% rabatu.",
    inq_3: "Zapytaj o planowaną wielkość zużycia kwartalnego.",
    inq_4: "Zaproponuj natychmiastową darmową wysyłkę kurierem.",
    inq_5: "Płatność przelewem 30 dni wymaga akceptacji dyrektora."
  });

  // Client generation parameters
  const [emailLanguage, setEmailLanguage] = useState<"pl" | "en" | "de">("pl");
  const [emailTone, setEmailTone] = useState<"professional" | "technical" | "friendly">("professional");
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({});

  // Global applet state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [metrics, setMetrics] = useState<MetricSummary>(defaultMetrics);

  const activeInquiry = inquiries.find(i => i.id === activeInquiryId) || inquiries[0];
  const activeAnalysis = analyses[activeInquiry.id];
  const activeProducts = products[activeInquiry.id] || [];
  const currentSelectedProdId = selectedProductId[activeInquiry.id];
  const activeCrossSells = crossSells[activeInquiry.id] || [];

  // Recalculating margin state based on selected item and targets
  const selectedProduct = activeProducts.find(p => p.id === currentSelectedProdId) || activeProducts[0];

  // Sync state or regenerate when inquiry loads
  useEffect(() => {
    // Reset wizard stage when switching inquiry to keep it consistent
    setStep(1);
  }, [activeInquiryId]);

  // Pricing helper
  const calculateMargin = (price: number, cost: number): number => {
    if (price <= 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const getMarginColorClass = (marginVal: number): string => {
    const diff = marginVal - targetMargin;
    if (diff >= 5) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (diff >= -5) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getMarginIndicatorDot = (marginVal: number): string => {
    const diff = marginVal - targetMargin;
    if (diff >= 5) return "bg-emerald-500";
    if (diff >= -5) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Move between wizard stages with subtle AI microinteractions
  const executeStepChange = (targetStep: number) => {
    if (targetStep === 2 && step === 1) {
      setLoadingMsg("Asystent analizuje zapytanie klienta...");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 900);
    } else if (targetStep === 3 && step === 2) {
      setLoadingMsg("AI skanuje zwalidowany katalog AutoPartner...");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 700);
    } else if (targetStep === 4 && step === 3) {
      generateDraftOfferMessage();
    } else {
      setStep(targetStep);
    }
  };

  // Call the server back-end to Parse the newly wklejone Custom inquiry
  const handleCustomInquirySubmit = async (
    clientName: string,
    companyName: string,
    email: string,
    body: string
  ) => {
    setIsCustomModalOpen(false);
    setLoadingMsg("Analizowanie przesłanego zapytania przez Gemini...");
    setIsLoading(true);

    const newInqId = `custom_${Date.now()}`;
    const newInq: Inquiry = {
      id: newInqId,
      clientName,
      companyName,
      email,
      time: "Teraz",
      subject: body.slice(0, 45) + "...",
      body,
      status: "new",
      location: "Kraków, weryfikacja z pliku",
      tags: ["AI", "Nowy Klient", "Zewnętrzne"],
      matchedCategory: "Weryfikacja katalogowa"
    };

    try {
      let parsedAnalysis: Analysis;
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body })
        });
        if (!response.ok) {
          throw new Error("Serwer zwrócił błąd: " + response.status);
        }
        const data = await response.json();
        parsedAnalysis = data.analysis;
      } catch (fetchErr) {
        console.warn("⚠️ Serwer API nie odpowiada lub jest niedostępny (np. na GitHub Pages). Uruchamiam lokalny silnik analizy (client-side AI simulator)...", fetchErr);
        parsedAnalysis = localSimulateAnalysis(body);
      }

      // Sformowanie dynamicznych produktów dopasowanych do wyodrębnionej części
      const partFound = parsedAnalysis.partName || "Część eksploatacyjna";
      const dummyProds: Product[] = [
        {
          id: `${newInqId}_p1`,
          name: `${partFound} klasowa OEM`,
          code: `OEM-PART-${Math.floor(Math.random() * 90000) + 10000}`,
          category: partFound,
          type: "OEM",
          originalPrice: 480,
          costPrice: 320,
          currentPrice: 480,
          availState: "in-stock",
          locationInfo: "Magazyn Kraków Centrala · 2 szt.",
          description: "Zalecana jakość fabryczna. Zamiennik 1:1."
        },
        {
          id: `${newInqId}_p2`,
          name: `${partFound} Bosch Premium`,
          code: `BOSCH-${Math.floor(Math.random() * 900000) + 100000}`,
          category: partFound,
          type: "ZAMIENNIK_1",
          originalPrice: 290,
          costPrice: 170,
          currentPrice: 290,
          availState: "in-stock",
          locationInfo: "Magazyn Kraków Rybitwy · 15 szt.",
          description: "Bardzo dobry stosunek jakości do ceny. Certyfikat bezpieczeństwa.",
          aiComment: "Dobry poziom marży dla warsztatu. Część certyfikowana."
        },
        {
          id: `${newInqId}_p3`,
          name: `${partFound} MaXgear Comfort`,
          code: `MG-${Math.floor(Math.random() * 900000) + 100000}`,
          category: partFound,
          type: "ZAMIENNIK_2",
          originalPrice: 160,
          costPrice: 105,
          currentPrice: 160,
          availState: "delay",
          locationInfo: "Dostawa 1 dzień roboczy",
          description: "Klasa ekonomiczna, popularna przy szybkich naprawach."
        }
      ];

      // Dedykowany cross-sell
      const dummyCross: CrossSellItem[] = [
        {
          id: `${newInqId}_cs1`,
          name: "Zmywacz uniwersalny AP Max 500ml",
          code: "MG-CLEAN-01",
          price: 15,
          costPrice: 6,
          reason: "Niezbędny środek montażowy podczas tej procedury mechanicznej.",
          checked: true
        }
      ];

      // Update state catalogs
      setInquiries(prev => [newInq, ...prev]);
      setAnalyses(prev => ({ ...prev, [newInqId]: parsedAnalysis }));
      setProducts(prev => ({ ...prev, [newInqId]: dummyProds }));
      setCrossSells(prev => ({ ...prev, [newInqId]: dummyCross }));
      setSelectedProductId(prev => ({ ...prev, [newInqId]: `${newInqId}_p2` }));
      setCustomNotes(prev => ({ ...prev, [newInqId]: "Pilny wyjazd zagraniczny klienta pod koniec tygodnia." }));

      setActiveInquiryId(newInqId);
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Call the server back-end to Composed email offer (Draft Generator)
  const generateDraftOfferMessage = async () => {
    setLoadingMsg("Komponowanie spersonalizowanej profesjonalnej oferty B2B z AI...");
    setIsLoading(true);

    try {
      let emailText = "";
      try {
        const response = await fetch("/api/generate-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: activeInquiry.clientName,
            companyName: activeInquiry.companyName,
            selectedProduct,
            altProducts: activeProducts.filter(p => p.id !== selectedProduct.id),
            crossSells: activeCrossSells,
            targetMargin,
            language: emailLanguage,
            tone: emailTone,
            customNotes: customNotes[activeInquiry.id] || ""
          })
        });
        if (!response.ok) {
          throw new Error("Serwer zwrócił błąd: " + response.status);
        }
        const data = await response.json();
        emailText = data.emailText;
      } catch (fetchErr) {
        console.warn("⚠️ Serwer API do generowania maili jest niedostępny (np. na GitHub Pages). Uruchamiam lokalny generator ofert (client-side AI generator)...", fetchErr);
        emailText = localSimulateEmail({
          clientName: activeInquiry.clientName,
          companyName: activeInquiry.companyName,
          selectedProduct,
          altProducts: activeProducts.filter(p => p.id !== selectedProduct.id),
          crossSells: activeCrossSells,
          targetMargin,
          language: emailLanguage,
          tone: emailTone,
          customNotes: customNotes[activeInquiry.id] || ""
        });
      }

      setGeneratedEmails(prev => ({
        ...prev,
        [activeInquiry.id]: emailText
      }));
      setStep(4);
    } catch (err) {
      console.error("Błąd podczas generowania maila:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Final Action Click
  const handleSendOffer = () => {
    setLoadingMsg("Zapisywanie oferty w CRM i wysyłka e-mail...");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Update inquiries list to reflect status SENT
      setInquiries(prev => prev.map(inq => {
        if (inq.id === activeInquiry.id) {
          return { ...inq, status: "sent" };
        }
        return inq;
      }));

      // Update local diagnostic stats counters
      setMetrics(prev => ({
        ...prev,
        totalSentOffers: prev.totalSentOffers + 1,
        avgQuotingTimeSec: Math.max(120, prev.avgQuotingTimeSec - 8) // simulate decrease
      }));

      setStep(5);
    }, 1200);
  };

  const handlePriceUpdate = (productId: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr) || 0;
    setProducts(prev => {
      const newList = (prev[activeInquiry.id] || []).map(p => {
        if (p.id === productId) {
          return { ...p, currentPrice: val };
        }
        return p;
      });
      return { ...prev, [activeInquiry.id]: newList };
    });
  };

  const handleCrossSellToggle = (itemId: string) => {
    setCrossSells(prev => {
      const newList = (prev[activeInquiry.id] || []).map(c => {
        if (c.id === itemId) {
          return { ...c, checked: !c.checked };
        }
        return c;
      });
      return { ...prev, [activeInquiry.id]: newList };
    });
  };

  const handleInquiryStatusChange = (status: "new" | "draft" | "sent") => {
    setInquiries(prev => prev.map(i => {
      if (i.id === activeInquiry.id) {
        return { ...i, status };
      }
      return i;
    }));
  };

  const selectedProductMargin = calculateMargin(selectedProduct?.currentPrice || 0, selectedProduct?.costPrice || 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans text-[#1e293b]" id="applet-viewport">
      
      {/* Target Geometric Balance Left Navigation Rail */}
      <nav className="hidden md:flex w-[72px] bg-[#0f172a] flex-col items-center py-6 gap-6 flex-shrink-0 border-r border-[#1e293b]/10 select-none">
        
        {/* Intranet logo block */}
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6] flex items-center justify-center font-black text-white tracking-tighter text-sm shadow-[0_0_15px_rgba(59,130,246,0.65)] hover:scale-105 duration-150">
          AP
        </div>
        
        {/* Navigation Rail functional modules representing Geometric Balance app-shell */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center cursor-pointer border border-[#3b82f6]/20 shadow-[0_0_10px_rgba(59,130,246,0.15)] hover:bg-[#3b82f6]/20 transition" title="Asystent Ofertowania B2B">
            <span className="text-lg font-bold">◆</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-800/20 text-[#64748b] flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:text-white transition" title="Automatyzacja Zgłoszeń">
            <span className="text-lg">◇</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-800/20 text-[#64748b] flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:text-white transition" title="Katalog Części TecDoc">
            <span className="text-lg">▥</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-800/20 text-[#64748b] flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:text-white transition" title="Ustawienia Profilu CRM">
            <span className="text-lg">▢</span>
          </div>
        </div>

        {/* Connection health visual indicator and settings gear */}
        <div className="mt-auto flex flex-col gap-5 items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[9px] text-emerald-400 font-bold font-mono uppercase tracking-wider scale-90">online</span>
          </div>
          
          <div className="w-11 h-11 rounded-xl bg-slate-800/20 text-[#64748b] flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:text-white transition" title="Ustawienia Systemu">
            <span className="text-lg">⚙</span>
          </div>
        </div>
      </nav>

      {/* Target Geometric Balance Second Column: Sidebar */}
      <div className="hidden md:flex w-[284px] flex-shrink-0 flex-col h-full overflow-hidden border-r border-[#e2e8f0]">
        <Sidebar
          inquiries={inquiries}
          activeInquiryId={activeInquiryId}
          onSelectInquiry={(id) => setActiveInquiryId(id)}
          onAddCustomInquiry={() => setIsCustomModalOpen(true)}
        />
      </div>

      {/* Target Geometric Balance Main Workspace Panel */}
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
        
        {/* Workspace Top Header Panel */}
        <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1e293b] tracking-tight flex items-center gap-2">
                Asystent Ofertowania B2B 
                <span className="text-[#3b82f6] bg-[#eff6ff] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#dbeafe]">
                  AutoPartner Max S.A.
                </span>
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Pulpit kalkulacji rentowności, doboru zamienników TecDoc i generowania e-mail z AI.
              </p>
            </div>
          </div>

          {/* User configuration controls */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#1e293b]">Tomasz Kowalski</p>
              <p className="text-[10px] text-[#64748b] font-medium">Region Kraków Rybitwy</p>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center text-[#3b82f6] font-bold text-xs shadow-xs">
              TK
            </div>
          </div>
        </header>

        {/* Scrollable Work Desk */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Diagnostic KPIs block */}
          <section>
            <KPIStats metrics={metrics} isPilotActive={true} />
          </section>

          {/* Interactive Assistant Process Board */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm max-w-5xl">
            
            {/* Steps Progress flow */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-semibold select-none">
                
                <div 
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition duration-150 ${step === 1 ? "bg-[#eff6ff] text-[#3b82f6]" : step > 1 ? "text-emerald-600" : "text-[#64748b]"}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? "bg-[#3b82f6] text-white" : step > 1 ? "bg-emerald-600 text-white" : "bg-white border border-[#e2e8f0] text-[#64748b]"}`}>
                    {step > 1 ? "✓" : "1"}
                  </div>
                  <span>1. E-mail</span>
                </div>
                <span className="hidden md:inline text-slate-300">→</span>

                <div 
                  onClick={() => activeAnalysis ? executeStepChange(2) : null}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition duration-150 ${step === 2 ? "bg-[#eff6ff] text-[#3b82f6]" : step > 2 ? "text-emerald-600" : "text-[#64748b]"} ${!activeAnalysis ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? "bg-[#3b82f6] text-white" : step > 2 ? "bg-emerald-600 text-white" : "bg-white border border-[#e2e8f0] text-[#64748b]"}`}>
                    {step > 2 ? "✓" : "2"}
                  </div>
                  <span>2. Ekstrakcja AI</span>
                </div>
                <span className="hidden md:inline text-slate-300">→</span>

                <div 
                  onClick={() => activeAnalysis ? executeStepChange(3) : null}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition duration-150 ${step === 3 ? "bg-[#eff6ff] text-[#3b82f6]" : step > 3 ? "text-emerald-600" : "text-[#64748b]"} ${!activeAnalysis ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? "bg-[#3b82f6] text-white" : step > 3 ? "bg-emerald-600 text-white" : "bg-white border border-[#e2e8f0] text-[#64748b]"}`}>
                    {step > 3 ? "✓" : "3"}
                  </div>
                  <span>3. Dobór & Marża</span>
                </div>
                <span className="hidden md:inline text-slate-300">→</span>

                <div 
                  onClick={() => activeAnalysis ? executeStepChange(4) : null}
                  className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition duration-150 ${step === 4 ? "bg-[#eff6ff] text-[#3b82f6]" : step > 4 ? "text-emerald-600" : "text-[#64748b]"} ${!activeAnalysis ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 4 ? "bg-[#3b82f6] text-white" : step > 4 ? "bg-emerald-600 text-white" : "bg-white border border-[#e2e8f0] text-[#64748b]"}`}>
                    {step > 4 ? "✓" : "4"}
                  </div>
                  <span>4. Oferta Mail</span>
                </div>
                <span className="hidden md:inline text-slate-300">→</span>

                <div 
                  className={`flex items-center gap-2 p-1.5 rounded ${step === 5 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-[#64748b]"}`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 5 ? "bg-emerald-600 text-white" : "bg-white border border-[#e2e8f0] text-[#64748b]"}`}>
                    5
                  </div>
                  <span>5. Wysyłka</span>
                </div>

              </div>
            </div>

            {/* ==================================
                STEP 1: Zapytanie e-mail (Odbiór)
                ================================== */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in" id="step-1-card">
                <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-xs">
                  
                  {/* Header Information */}
                  <div className="bg-slate-50 border-b border-[#e2e8f0] p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#64748b]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#eff6ff] text-[#3b82f6] border border-[#dbeafe] rounded-full flex items-center justify-center font-bold text-sm">
                        {activeInquiry.clientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1e293b] text-sm leading-none">{activeInquiry.clientName}</h4>
                        <p className="text-[11px] font-mono mt-1 text-[#64748b]">{activeInquiry.email}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-semibold text-[#1e293b]">Wpłynęło: {activeInquiry.time}</p>
                      <p className="text-[11px] font-mono text-[#64748b] mt-0.5">{activeInquiry.location}</p>
                    </div>
                  </div>

                  {/* Email Subject & Tags */}
                  <div className="p-5 border-b border-[#e2e8f0] bg-white">
                    <h2 className="text-base font-black text-[#1e293b] mb-3">
                      {activeInquiry.subject}
                    </h2>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-extrabold text-[#3b82f6] bg-[#eff6ff] border border-[#dbeafe] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        Segment B2b: Klient Stały
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        Priorytet: ASAP
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-[#e2e8f0] px-2 py-0.5 rounded-sm uppercase font-mono tracking-wide">
                        {activeInquiry.matchedCategory}
                      </span>
                    </div>
                  </div>

                  {/* Email Core Body Material */}
                  <div className="p-6 text-sm text-[#1e293b] leading-relaxed whitespace-pre-wrap font-sans">
                    {activeInquiry.body}
                  </div>

                </div>

                {/* Bot offering generation prompt helper */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles className="text-emerald-600" size={14} /> Automatyczna synchronizacja IMAP
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      To zapytanie e-mail pobrano i powiązano z systemem automatycznie. Handlowiec nie musi niczego przepisywać! Kliknij poniżej, aby AI przetworzyło kody i policzyło marżę.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => executeStepChange(2)}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition whitespace-nowrap cursor-pointer"
                  >
                    Przeanalizuj przez AI <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================
                STEP 2: Eksploracja parametrów (Analiza AI)
                ================================== */}
            {step === 2 && activeAnalysis && (
              <div className="space-y-4 animate-fade-in" id="step-2-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Visualizer card representing Original Mail Context */}
                  <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                        <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                          Oryginalna wiadomość e-mail
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          ID: {activeInquiry.id.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-[#e2e8f0] rounded-lg p-3 text-xs text-[#64748b] space-y-2 leading-relaxed">
                        <b className="text-slate-800">Od:</b> {activeInquiry.clientName} ({activeInquiry.email})
                        <div className="h-px bg-slate-200 my-1"></div>
                        <p className="italic max-h-[200px] overflow-y-auto pr-1">
                          &quot;{activeInquiry.body.slice(0, 400)}...&quot;
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[11px] text-[#64748b] font-medium">
                        Weryfikacja danych w centralnym rejestrze warsztatów AutoPartner Max.
                      </p>
                    </div>
                  </div>

                  {/* Analytical AI parameter mapping widget */}
                  <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-100 mb-3">
                      <h3 className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="text-[#3b82f6]" size={14} /> Parametry Wyodrębnione przez AI
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                        Pewność: 98%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Typ Partnera:</span>
                        <strong className="text-[#1e293b] text-right font-semibold">{activeAnalysis.clientStatus}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Pojazd:</span>
                        <strong className="text-[#1e293b] text-right font-semibold">{activeAnalysis.brand} {activeAnalysis.model}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Rok Produkcji:</span>
                        <strong className="text-[#1e293b] font-semibold">{activeAnalysis.year || "Brak danych w mailu"}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Kod Silnika:</span>
                        <strong className="text-[#1e293b] font-mono">{activeAnalysis.engineCode || "Brak danych"}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Poszukiwana Część:</span>
                        <strong className="text-[#3b82f6] font-bold">{activeAnalysis.partName}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Wolumen:</span>
                        <strong className="text-[#1e293b] font-semibold">{activeAnalysis.quantity} szt.</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-[#64748b]">Status Pilności:</span>
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-amber-200">
                          {activeAnalysis.urgency}
                        </span>
                      </div>

                      <div className="py-2">
                        <p className="text-[11px] font-bold text-rose-600 mb-1 flex items-center gap-1">
                          ⚡ Brakujące dane do dokładnego dopasowania (Zalecany VIN):
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeAnalysis.missingData.map((mis, idx) => (
                            <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-150 px-2 py-0.5 rounded text-[10px] font-mono">
                              {mis}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bot Advice and Routing info */}
                <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4.5 text-xs text-[#1e40af]">
                  <div className="font-bold text-[#1e40af] mb-1 flex items-center gap-1 uppercase tracking-wider">
                    🤖 Instrukcja Dynamiczna Asystenta:
                  </div>
                  System sformułował uprzejme wezwanie do podania numeru VIN, uodparniając zamawiającego warsztat przed błędem zwrotu na koszt AutoPartner Max. Możesz wysłać to zapytanie natychmiast lub przejść do suwaka kalkulacji marży.
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => executeStepChange(1)}
                    className="px-4 py-2 border border-[#e2e8f0] rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1e293b] transition duration-150 cursor-pointer"
                  >
                    ← Podgląd wiadomości e-mail
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Uprzejme dopytanie o powiązane parametry zostało wysłane na: " + activeInquiry.email);
                        handleInquiryStatusChange("draft");
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 hover:border-slate-800 rounded-xl text-xs font-bold transition duration-150 cursor-pointer"
                    >
                      Dopytaj o VIN
                    </button>
                    <button
                      type="button"
                      onClick={() => executeStepChange(3)}
                      className="px-5 py-2.5 bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition duration-150 flex items-center gap-1.5 cursor-pointer"
                    >
                      Dobierz części i policz marżę <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================
                STEP 3: Dopasowanie kompatybilności & Ustawienia Marży
                ================================== */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in" id="step-3-card">
                
                {/* Dynamic Adjustable Margin Controller Widget */}
                <div className="bg-[#0f172a] text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row gap-5 items-stretch justify-between">
                  <div className="flex-1 space-y-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider text-white">
                        <Sliders className="text-[#3b82f6]" size={15} /> Kalkulator marży i narzutu
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        Dynamicznie przesuwaj suwak, aby na bieżąco kontrolować próg rentowności i weryfikować marżę poszczególnych opcji części z bazy TecDoc.
                      </p>
                    </div>

                    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-2.5 mt-2">
                      <p className="text-[11px]">
                        Aktualna marża wybranej opcji części: <span className="text-[#3b82f6] font-black text-xs">{selectedProductMargin}%</span>
                        {selectedProductMargin >= targetMargin ? (
                          <span className="text-emerald-400 font-bold ml-1.5">✓ Zgodna z celem handlowym</span>
                        ) : (
                          <span className="text-rose-450 text-rose-400 font-bold ml-1.5">⚠️ Poniżej celu handlowego</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs text-slate-400 font-semibold">Cenowy Próg Celu (%)</span>
                      <span className="text-lg font-black text-[#3b82f6] font-mono">{targetMargin}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="45"
                      step="1"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(parseInt(e.target.value))}
                      className="w-full accent-[#3b82f6] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1.5 font-mono">
                      <span>10% (Min)</span>
                      <span>30% (Optimum)</span>
                      <span>45% (Max)</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Recalculated Parts Card List Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                      <Coins size={14} className="text-[#3b82f6]" /> Dedykowane propozycje części ({activeProducts.length})
                    </h3>
                    <span className="text-[10px] text-[#64748b]">
                      Wybierz wiodącą klasę części, aby osadzić ją w e-mailu
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeProducts.map((prod) => {
                      const isSelected = prod.id === currentSelectedProdId;
                      const calculatedMargin = calculateMargin(prod.currentPrice, prod.costPrice);
                      const isAIRecommendation = prod.type === "ZAMIENNIK_1" || prod.id.includes("_p2");

                      return (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProductId(prev => ({ ...prev, [activeInquiry.id]: prod.id }))}
                          className={`p-4 bg-white border rounded-xl cursor-pointer transition-all duration-150 relative flex flex-col md:flex-row md:items-center justify-between gap-4 group 
                            ${
                              isSelected 
                                ? "border-[#3b82f6] bg-[#eff6ff] ring-2 ring-[#3b82f6]/10 shadow-xs" 
                                : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                            }`}
                        >
                          {/* Upper left AI highlight label badge */}
                          {isAIRecommendation && (
                            <div className="absolute -top-2.5 left-4 bg-[#3b82f6] text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-xs border border-blue-400">
                              <Sparkles size={8} /> Rekomendacja AI
                            </div>
                          )}

                          {/* Name Info block */}
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                              ${
                                isSelected 
                                  ? "border-[#3b82f6] bg-[#3b82f6]" 
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1e293b] text-sm group-hover:text-[#3b82f6] transition-colors leading-snug">
                                {prod.name}
                              </h4>
                              <p className="text-[10px] text-[#64748b] font-mono mt-1">
                                Indeks produktu: {prod.code}
                              </p>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                {prod.description}
                              </p>
                              
                              {/* Live AI optimization description */}
                              {prod.aiComment && (
                                <p className="text-xs text-[#2563eb] mt-2 italic font-medium flex items-center gap-1 bg-white border border-[#dbeafe] py-1 px-2.5 rounded-md">
                                  <Sparkles size={11} className="text-[#3b82f6]" /> {prod.aiComment}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price adjusting column with wholesale info */}
                          <div className="flex flex-row md:flex-col justify-between md:items-end gap-3 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                            
                            {/* Live Adjustable input value */}
                            <div className="text-left md:text-right">
                              <span className="text-[10px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">Cena Netto Klienta</span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  value={prod.currentPrice}
                                  min={prod.costPrice}
                                  onClick={(e) => e.stopPropagation()} 
                                  onChange={(e) => handlePriceUpdate(prod.id, e.target.value)}
                                  className="w-20 px-2 py-1 bg-slate-50 border border-[#e2e8f0] rounded-lg font-bold text-xs text-[#1e293b] text-center font-mono focus:bg-white outline-none focus:ring-1 focus:ring-[#3b82f6]"
                                />
                                <span className="text-xs font-bold text-[#1e293b]">PLN</span>
                              </div>
                              <p className="text-[10px] text-[#64748b] mt-1.5 font-mono">
                                Zakup hurtowy: {prod.costPrice} PLN • Marża: {calculatedMargin}%
                              </p>
                            </div>

                            {/* Computed Margin colors */}
                            <div className="text-right flex flex-col items-end justify-center">
                              <span className="text-[11px] text-[#64748b] block mb-1 uppercase">Sygnał Marżowy</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1.5 transition-colors ${getMarginColorClass(calculatedMargin)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${getMarginIndicatorDot(calculatedMargin)}`}></span>
                                Marża {calculatedMargin}%
                              </span>
                              
                              <span className={`text-[10px] mt-1.5 font-semibold ${prod.availState === "in-stock" ? "text-emerald-600" : prod.availState === "delay" ? "text-amber-600" : "text-rose-500"}`}>
                                {prod.locationInfo}
                              </span>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic upsell / Cross-sell suggest module */}
                <div className="bg-[#eff6ff]/30 border border-[#dbeafe] rounded-xl p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-3">
                    <h4 className="text-xs font-bold text-[#3b82f6] flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles size={14} className="text-[#3b82f6]" /> Rekomendowany zestaw pomocniczy (Cross-Sell)
                    </h4>
                    <span className="text-[10px] text-[#1e40af] font-bold uppercase tracking-wider">
                      Zaznacz dodatki, aby załączyć w ofercie B2B
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeCrossSells.map((cs) => (
                      <div 
                        key={cs.id}
                        onClick={() => handleCrossSellToggle(cs.id)}
                        className="flex items-start gap-3 p-3 bg-white border border-[#e2e8f0] rounded-lg hover:border-[#3b82f6] cursor-pointer select-none transition"
                      >
                        <input
                          type="checkbox"
                          checked={cs.checked}
                          onChange={() => {}} 
                          className="mt-0.5 accent-[#3b82f6]"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-[#1e293b]">{cs.name}</span>
                            <span className="text-xs font-bold font-mono text-[#3b82f6]">{cs.price} PLN</span>
                          </div>
                          <p className="text-[11px] text-[#64748b] mt-1">
                            {cs.reason}
                          </p>
                        </div>
                      </div>
                    ))}

                    {activeCrossSells.length === 0 && (
                      <p className="text-xs text-[#64748b] italic">Brak rekomendacji dodatkowych dla tej kategorii części.</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons to write Draft */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => executeStepChange(2)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    ← Podgląd wyodrębnionych danych
                  </button>
                  <button
                    type="button"
                    onClick={() => executeStepChange(4)}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-sm transition cursor-pointer"
                  >
                    Generuj profesjonalną treść e-mail <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================
                STEP 4: Edycja i Dostosowanie Treści (AI Draft generator)
                ================================== */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in" id="step-4-card">
                
                <div className="bg-slate-50 border border-[#e2e8f0] rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                  
                  {/* Advanced Language select & Tone adjusting options */}
                  <div className="flex flex-wrap items-center gap-4">
                    
                    {/* Language widget selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1 flex items-center gap-1">
                        <Globe size={11} className="text-[#3b82f6]" /> Język odpowiedzi
                      </label>
                      <div className="inline-flex rounded-lg shadow-xs bg-white p-0.5 border border-[#e2e8f0]">
                        <button
                          onClick={() => setEmailLanguage("pl")}
                          className={`px-3 py-1 text-xs rounded-md font-bold transition duration-150 cursor-pointer ${emailLanguage === "pl" ? "bg-[#3b82f6] text-white" : "text-[#1e293b]"}`}
                        >
                          Polski
                        </button>
                        <button
                          onClick={() => setEmailLanguage("en")}
                          className={`px-3 py-1 text-xs rounded-md font-bold transition duration-150 cursor-pointer ${emailLanguage === "en" ? "bg-[#3b82f6] text-white" : "text-[#1e293b]"}`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setEmailLanguage("de")}
                          className={`px-3 py-1 text-xs rounded-md font-bold transition duration-150 cursor-pointer ${emailLanguage === "de" ? "bg-[#3b82f6] text-white" : "text-[#1e293b]"}`}
                        >
                          Deutsch
                        </button>
                      </div>
                    </div>

                    {/* Pitch tone selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748b] uppercase mb-1">
                        Styl & Ton kalkulacji
                      </label>
                      <select
                        value={emailTone}
                        onChange={(e) => setEmailTone(e.target.value as any)}
                        className="bg-white border border-[#e2e8f0] rounded-lg p-1.5 px-3 text-xs font-semibold text-[#1e293b] outline-none"
                      >
                        <option value="professional">Profesjonalny & Konkretny</option>
                        <option value="technical">Specyfikacja Techniczna (Kody OEM/Zamienniki)</option>
                        <option value="friendly">Przyjazny & Partnerski (Zaufanie)</option>
                      </select>
                    </div>

                  </div>

                  {/* Regeneration prompt trigger */}
                  <button
                    type="button"
                    onClick={generateDraftOfferMessage}
                    className="bg-white text-[#3b82f6] border border-[#3b82f6] font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#eff6ff] transition cursor-pointer"
                  >
                    <RefreshCw size={12} /> Zregeneruj przez AI
                  </button>
                </div>

                {/* Layout for draft text area & side quick recap */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Visual generated raw mock e-mail body input */}
                  <div className="lg:col-span-8 flex flex-col bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-50 p-3.5 px-4 border-b border-[#e2e8f0] flex justify-between items-center">
                      <span className="text-xs font-bold text-[#3b82f6] flex items-center gap-1.5">
                        <Mail size={13} /> Podgląd generowanej oferty handlowej
                      </span>
                      <span className="text-[10px] text-[#64748b] font-mono">
                        Możesz edytować tekst bezpośrednio
                      </span>
                    </div>
                    
                    <div className="p-4 bg-slate-50/20 border-b border-slate-100 grid grid-cols-1 gap-1.5 text-xs">
                      <div>
                        <span className="text-[#64748b] inline-block w-14">Odbiorca:</span>
                        <strong className="text-slate-700">{activeInquiry.email}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748b] inline-block w-14">Temat:</span>
                        <strong className="text-slate-705">Oferta parts-B2B — {selectedProduct.category} · Ref: [AP-MAX-{activeInquiry.id.toUpperCase()}]</strong>
                      </div>
                    </div>

                    <div className="p-4 flex-1">
                      <textarea
                        value={generatedEmails[activeInquiry.id] || ""}
                        onChange={(e) => setGeneratedEmails(prev => ({ ...prev, [activeInquiry.id]: e.target.value }))}
                        rows={16}
                        className="w-full text-xs leading-relaxed font-mono bg-white p-3 border border-[#e2e8f0] rounded-xl outline-none focus:ring-1 focus:ring-[#3b82f6] resize-none"
                      />
                    </div>
                  </div>

                  {/* Right quick specifications helper parameter overview */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs">
                      <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-100">
                        Wybrany Podzespół
                      </h4>
                      <div className="text-xs space-y-2">
                        <p className="font-bold text-[#1e293b] leading-tight">{selectedProduct.name}</p>
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-slate-500">Netto kupującego:</span>
                          <strong className="text-sm font-black text-[#1e293b]">{selectedProduct.currentPrice} PLN</strong>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500">Osiągnięta Marża:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getMarginColorClass(selectedProductMargin)}`}>
                            {selectedProductMargin}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive notes prompt box to adjust generation */}
                    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs">
                      <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                        Dodatkowe dyspozycje handlowe
                      </h4>
                      <p className="text-[10px] text-[#64748b] leading-relaxed mb-2">
                        Wpisz np. upust kwotowy, darmowego kuriera lub czas oczekiwania. Wciśnij &quot;Zregeneruj&quot;, aby asystent przepisał całą korespondencję.
                      </p>
                      <textarea
                        value={customNotes[activeInquiry.id] || ""}
                        onChange={(e) => setCustomNotes(prev => ({ ...prev, [activeInquiry.id]: e.target.value }))}
                        placeholder="Np. dodaj 5% rabatu na tylne tarcze przy zakupie kompletu..."
                        rows={4}
                        className="w-full p-2.5 text-xs border border-[#e2e8f0] rounded-lg outline-none focus:border-[#3b82f6]"
                      />
                    </div>

                    <div className="bg-[#0f172a] text-white rounded-xl p-4.5 border border-slate-800">
                      <h5 className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                        Synchronizacja CRM Max.
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Po kliknięciu przycisku &quot;Wyślij&quot; program połączy się z Twoją historią transakcji w CRM handlowca, automatycznie notując wyliczone progi.
                      </p>
                    </div>

                  </div>

                </div>

                {/* Action operations in footer */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    ← Popraw tarcze marży i dodatki
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Szkic kalkulacji został pomyślnie zsynchronizowany w systemie ERP.");
                        handleInquiryStatusChange("draft");
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Zapisz wersję roboczą
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOffer}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Wyślij Gotową Ofertę <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ==================================
                STEP 5: Konfirmacja powiadomienia (Wysyłka sukces)
                ================================== */}
            {step === 5 && (
              <div className="space-y-6 max-w-2xl mx-auto text-center py-10 animate-fade-in" id="step-5-card">
                
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                  <Check className="stroke-[3]" size={32} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-black text-[#1e293b]">Oferta e-mail została pomyślnie nadana!</h2>
                  <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
                    Partner otrzymał gotowy plik kalkulacji i szczegółowy dobór części na adres: <strong className="text-[#1e293b]">{activeInquiry.email}</strong>. Korespondencja handlowa figuruje pod identyfikatorem zgłoszenia <span className="font-mono bg-slate-100 p-0.5 px-2 rounded text-rose-600 font-bold border border-slate-200">AP-MIN-{activeInquiryId.toUpperCase()}</span>.
                  </p>
                </div>

                {/* Highlight dynamic metrics report */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 max-w-lg mx-auto text-left shadow-xs">
                  <h4 className="text-[11px] font-bold text-[#1e293b] uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                    Raport Kooperacji B2B z Wytycznymi Marżowymi
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">Pojazd / Część</span>
                      <strong className="text-[#1e293b]">{selectedProduct.category}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">Zarejestrowany Zysk Marży</span>
                      <strong className="text-emerald-600 font-bold">{selectedProductMargin}% (Zgodny)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">Cross-sell Akcesoriów</span>
                      <strong className="text-[#1e293b]">
                        {activeCrossSells.filter(c => c.checked).length > 0 ? "Załączone do wysyłki" : "Wyłączone"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">Czas Reakcji Handlowej</span>
                      <strong className="text-[#3b82f6] font-mono">1 min 24 sek (oszczędność 82%)</strong>
                    </div>
                  </div>
                </div>

                {/* Navigation button directions */}
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                    }}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-750 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw size={13} /> Kalkuluj kolejny e-mail
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Otwieranie raportu i globalnych statystyk bazy w zakładce wewnętrznej...");
                    }}
                    className="px-4 py-2 bg-[#0f172a] text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Przejdź do głównej bazy CRM
                  </button>
                </div>

              </div>
            )}

          </div>

        </main>

        {/* Workspace Footer disclaimer */}
        <footer className="bg-white border-t border-[#e2e8f0] text-center p-3 text-[10px] text-[#64748b] flex flex-col md:flex-row md:justify-between px-6 gap-2 flex-shrink-0 select-none">
          <div>
            System Wspomagania Rentowności Handlowej AutoPartner Max S.A.
          </div>
          <div>
            Kierunek Innowacyjności AI · Inteligentne Systemy Dystrybucyjne S.A.
          </div>
        </footer>

      </div>

      {/* Global AI Loading thinking Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center gap-4 border border-[#e2e8f0] max-w-sm">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-[#3b82f6] animate-spin"></div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1e293b]">{loadingMsg}</p>
              <p className="text-[10px] text-[#64748b] mt-0.5">Generowanie wariantów, dobór marek i mapowanie marży...</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Inquiry upload modal */}
      {isCustomModalOpen && (
        <CustomInquiryModal
          onClose={() => setIsCustomModalOpen(false)}
          onSubmit={handleCustomInquirySubmit}
        />
      )}

    </div>
  );
}
