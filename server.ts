import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI client
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("⚠️ [GEMINI] Brak klucza GEMINI_API_KEY. Serwer przejdzie w tryb zaawansowanej symulacji katalogowej.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. API: ANALIZA ZAPYTANIA (AI Parsing)
app.post("/api/analyze", async (req, res) => {
  const { body } = req.body;
  if (!body) {
    return res.status(400).json({ error: "Brak treści zapytania do analizy." });
  }

  const ai = getAI();
  if (!ai) {
    // Graceful fallback to regex-based/mock simulated matching for the demo
    console.log("[SERVER] Użycie symulowanej analizy B2B...");
    return res.json({
      isMock: true,
      analysis: simulateAnalysis(body),
    });
  }

  try {
    const prompt = `Analizujesz zapytanie ofertowe od klienta B2B warsztatu samochodowego. Wyodrębnij z poniższej wiadomości kluczowe dane w formacie JSON zgodnym ze strukturą.

Wiadomość klienta:
"""
${body}
"""

Zwróć DOKŁADNIE obiekt JSON o następujących właściwościach (użyj języka polskiego):
- clientStatus: krótka informacja o kliencie, np. "Klient indywidualny" lub "Warsztat samochodowy z zapytania"
- brand: marka pojazdu (np. Ford, Audi itp.)
- model: model pojazdu (np. Focus, A4 itp.)
- year: rocznik pojazdu jako tekst (np. "2015" lub "brak")
- engineCode: informacja o silniku (np. "1.6 diesel", "2.0 TDI" lub "brak")
- partName: nazwa szukanej części (np. Pompa paliwa, Klocki hamulcowe itp.)
- quantity: liczba sztuk szukanej części jako liczba całkowita (domyślnie 1)
- urgency: pilność zgłoszenia, np. "bardzo wysoka", "średnia", "niska" na podstawie kontekstu sformułowań
- expectations: ogólne oczekiwania klienta (np. "szuka najtańszego zamiennika", "potrzebuje oferty na już" itp.)
- missingData: tablica stringów określająca brakujące precyzyjne dane techniczne do bezbłędnego doboru w katalogu TecDoc, np. ["VIN", "kod silnika"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientStatus: { type: Type.STRING },
            brand: { type: Type.STRING },
            model: { type: Type.STRING },
            year: { type: Type.STRING },
            engineCode: { type: Type.STRING },
            partName: { type: Type.STRING },
            quantity: { type: Type.INTEGER },
            urgency: { type: Type.STRING },
            expectations: { type: Type.STRING },
            missingData: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "clientStatus", "brand", "model", "year", "engineCode", 
            "partName", "quantity", "urgency", "expectations", "missingData"
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    const analysis = JSON.parse(resultText);
    res.json({ isMock: false, analysis });
  } catch (error: any) {
    console.error("Błąd podczas analizy Gemini:", error);
    res.json({
      isMock: true,
      error: error.message,
      analysis: simulateAnalysis(body),
    });
  }
});

// 2. API: GENEROWANIE WIADOMOŚCI E-MAIL Z OFERTĄ (B2B Email Generator)
app.post("/api/generate-email", async (req, res) => {
  const {
    clientName,
    companyName,
    selectedProduct,
    altProducts = [],
    crossSells = [],
    targetMargin,
    language = "pl",
    tone = "professional",
    customNotes = ""
  } = req.body;

  const ai = getAI();
  if (!ai) {
    console.log("[SERVER] Użycie symulowanego generatora maili...");
    return res.json({
      isMock: true,
      emailText: simulateEmail(req.body)
    });
  }

  try {
    const productsListStr = `WYBRANY PRODUKT GŁÓWNY:
- Nazwa: ${selectedProduct.name}
- Kod części/indeks: ${selectedProduct.code}
- Zaproponowana cena netto dla klienta: ${selectedProduct.currentPrice} PLN
- Dostępność/magazyn: ${selectedProduct.locationInfo}
- Gwarancja/status: ${selectedProduct.description}

ALTERNATYWY:
${altProducts.map((p: any) => `- ${p.name} (Kod: ${p.code}) w cenie ${p.currentPrice} PLN netto [Dostępność: ${p.locationInfo}]`).join("\n")}

SUGEROWANE DODATKI (CROSS-SELL):
${crossSells.filter((c: any) => c.checked).map((c: any) => `- ${c.name} (Kod: ${c.code}) w cenie ${c.price} PLN netto (Powód: ${c.reason})`).join("\n")}`;

    const prompt = `Jesteś doświadczonym, profesjonalnym doradcą technicznym i handlowcem B2B w hurtowni części samochodowych AutoPartner Max S.A.
Twoim zadaniem jest sformułowanie kompletnej, zwięzłej i profesjonalnej odpowiedzi e-mail na zapytanie ofertowe klienta.

KLIENT:
- Imię i nazwisko: ${clientName}
- Nazwa firmy: ${companyName}

PARAMETRY OFERTY:
${productsListStr}

USTAWIENIA WIADOMOŚCI:
- Język: ${language === "en" ? "Angielski (English)" : language === "de" ? "Niemiecki (German)" : "Polski (Polish)"}
- Ton wypowiedzi: ${tone === "technical" ? "bardzo techniczny, podający szczegółowe specyfikacje i kody OEM" : tone === "friendly" ? "bardziej bezpośredni, przyjazny lecz wciąż w pełni biznesowy" : "klasyczny profesjonalny, konkretny i elegancki"}
- Dodatkowe uwagi handlowca do uwzględnienia: ${customNotes || "(brak)"}

WYMOGI FORMALNE:
1. Napisz maila w całości w wybranym języku (${language}).
2. Wyróżnij produkt główny jako zalecaną, najlepszą opcję. Podaj jego cenę netto, korzyści i dostępność.
3. Rzeczowo przedstaw alternatywne opcje o ile zostały podane.
4. Przedstaw propozycję uzupełniającą (cross-sell np. filtry lub płyny) jako rekomendację prewencyjną dla warsztatu.
5. Poproś o przesłanie numeru VIN w celu 100% weryfikacji kompatybilności w bazie TecDoc (rekomendacja bezpieczeństwa warsztatowa).
6. Zamieść profesjonalne zakończenie oferty oraz podpis handlowca:
   Tomasz Kowalski
   Senior Handlowiec B2B · AutoPartner Max S.A.
   +48 600 000 000 | tomasz.kowalski@autopartnermax.pl

Nie dodawaj żadnych tagów markdown obramowujących cały mail (jak \`\`\`html albo \`\`\`text), po prostu czysty tekst gotowy do wklejenia do okna dialogowego.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({
      isMock: false,
      emailText: response.text || ""
    });
  } catch (error: any) {
    console.error("Błąd podczas generowania e-maila Gemini:", error);
    res.json({
      isMock: true,
      error: error.message,
      emailText: simulateEmail(req.body)
    });
  }
});

// ZAPYTANIA REWIDUALNE / SYMULATORY DLA TRYBU BEZ KLUCZA
function simulateAnalysis(body: string) {
  const norm = body.toLowerCase();
  
  if (norm.includes("focus") || norm.includes("ford") || norm.includes("pomp")) {
    return {
      clientStatus: "Warsztat Marek Wójcik · Aktywny VIP (CRM: #6822)",
      brand: "Ford",
      model: "Focus Mk3",
      year: "2015",
      engineCode: "1.6 TDCi (diesel)",
      partName: "Pompa paliwa",
      quantity: 1,
      urgency: "Szybka (samochód na podnośniku, klient czeka na jutro)",
      expectations: "Porównanie opcji: oryginał vs tańszy, trwały zamiennik",
      missingData: ["Numer VIN", "Kod silnika z tabliczki (np. T1DA / T1DB)"]
    };
  } else if (norm.includes("audi") || norm.includes("klock") || norm.includes("a4")) {
    return {
      clientStatus: "AutoFix Sp. z o.o. · Partner Flotowy (CRM: #4511)",
      brand: "Audi",
      model: "A4 B8",
      year: "2012",
      engineCode: "2.0 TDI",
      partName: "Klocki hamulcowe tył",
      quantity: 4,
      urgency: "Wysoka (odbiór dziś lub jutro rano)",
      expectations: "Opcja premium (Ate/TRW) vs budżet (Kamoka), rabato-efekt",
      missingData: ["VIN w celu weryfikacji średnicy tarczy (288mm vs 300mm)"]
    };
  } else if (norm.includes("filtr") || norm.includes("olej") || norm.includes("knecht") || norm.includes("mann")) {
    return {
      clientStatus: "Warsztat Premium & Detailing · Stała współpraca (CRM: #1219)",
      brand: "VW VAG",
      model: "Pojazdy z silnikiem 2.0 TDI",
      year: "2015-2022",
      engineCode: "2.0 TDI (CR)",
      partName: "Filtr oleju (Hurt)",
      quantity: 20,
      urgency: "Średnia (zamówienie magazynowe cykliczne)",
      expectations: "Marki Knecht/Mann/Bosch, stały upust hurtowy cykliczny",
      missingData: ["Dokładne numery seryjne OEM oczekiwanych obudów filtrów"]
    };
  } else if (norm.includes("skoda") || norm.includes("octavia") || norm.includes("rozrząd") || norm.includes("wod")) {
    return {
      clientStatus: "Mechanik24 Całodobowy · Stały warsztat (CRM: #3312)",
      brand: "Skoda",
      model: "Octavia II",
      year: "2008",
      engineCode: "1.9 TDI (105 KM)",
      partName: "Pompa wody",
      quantity: 1,
      urgency: "Krytyczna (auto rozebrane w locie)",
      expectations: "Dobra cena pompy wody + propozycja pełnego zestawu rozrządu (upsell)",
      missingData: ["Oznaczenie silnika (BXE bez DPF / BLS z DPF)"]
    };
  } else if (norm.includes("scania") || norm.includes("tarcz") || norm.includes("truck")) {
    return {
      clientStatus: "Grabowski Trans Logistics · Klient Truck (CRM: #1008)",
      brand: "Scania",
      model: "R420 Truck",
      year: "2011",
      engineCode: "DC12 15 (420 KM)",
      partName: "Tarcze hamulcowe tył + klocki",
      quantity: 2,
      urgency: "Wysoka (flota handlowa)",
      expectations: "Textar/Haldex lub marka własna HD, kredyt kupiecki",
      missingData: ["Numer podwozia Scania", "Wersja zacisku (Bendix / Meritor)"]
    };
  }

  // Generic custom text analyzer fallback
  return {
    clientStatus: "Nowe zapytanie (Kontakt z formularza)",
    brand: "Weryfikowane automatycznie",
    model: "Zidentyfikowano w zapytaniu",
    year: "Do potwierdzenia",
    engineCode: "Do zweryfikowania",
    partName: "Zidentyfikowano część na podstawie opisu",
    quantity: 1,
    urgency: norm.includes("pil") || norm.includes("asap") || norm.includes("szyb") ? "Wysoka" : "Normalna",
    expectations: "Wyszukanie optymalnych zamienników i części oryginalnych",
    missingData: ["Numer nadwozia VIN", "Dokładny rok produkcji", "Srebrna tabliczka znamionowa"]
  };
}

function simulateEmail(params: any) {
  const { clientName, companyName, selectedProduct, altProducts = [], crossSells = [], language = "pl" } = params;

  if (language === "en") {
    return `Hello ${clientName},

Thank you for your B2B inquiry for ${companyName}. Please find our official proposal below:

RECOMMENDED PART (Best Quality & Value):
• ${selectedProduct.name} - ${selectedProduct.currentPrice} PLN net
• Part code: ${selectedProduct.code}
• Availability: ${selectedProduct.locationInfo}
• Note: ${selectedProduct.description}

ADDITIONAL OPTIONS:
${altProducts.map((p: any) => `• ${p.name} — ${p.currentPrice} PLN net (${p.locationInfo})`).join("\n")}

RECOMMENDED CROSS-SELL:
${crossSells.filter((c: any) => c.checked).map((c: any) => `• ${c.name} — ${c.price} PLN net. Reason: ${c.reason}`).join("\n")}

In order to double check and block any potential shipping error in our database, please reply with the vehicle's 17-digit VIN number.

Kind regards,
Tomasz Kowalski
Senior Sales Specialist · AutoPartner Max S.A.
+48 600 000 000 | tomasz.kowalski@autopartnermax.pl`;
  }

  if (language === "de") {
    return `Sehr geehrter Herr ${clientName},

vielen Dank für Ihre B2B-Anfrage für ${companyName}. Hier ist unser Angebot:

EMPFOHLENE OPTION:
• ${selectedProduct.name} - ${selectedProduct.currentPrice} PLN netto
• Teilenummer: ${selectedProduct.code}
• Verfügbarkeit: ${selectedProduct.locationInfo}
• Details: ${selectedProduct.description}

ALTERNATIVER BAUTEILE:
${altProducts.map((p: any) => `• ${p.name} — ${p.currentPrice} PLN netto (${p.locationInfo})`).join("\n")}

ZUSÄTZLICHE EMPFEHLUNGEN (Cross-sell):
${crossSells.filter((c: any) => c.checked).map((c: any) => `• ${c.name} — ${c.price} PLN netto. Grund: ${c.reason}`).join("\n")}

Bitte senden Sie uns Ihre 17-stellige Fahrgestellnummer (FIN) zur fehlerfreien Zuordnung im TecDoc-Katalog.

Mit freundlichen Grüßen,
Tomasz Kowalski
B2B Key Account Manager · AutoPartner Max S.A.
+48 600 000 000 | tomasz.kowalski@autopartnermax.pl`;
  }

  return `Dzień dobry Panie ${clientName},

Dziękuję za kontakt i zapytanie ofertowe dla firmy ${companyName || "Państwa warsztatu"}. Przygotowałem dedykowaną kalkulację:

REKOMENDOWANY PRODUKT GŁÓWNY:
• ${selectedProduct.name} — ${selectedProduct.currentPrice} zł netto / szt.
• Kod części/indeks: ${selectedProduct.code}
• Dostępność: ${selectedProduct.locationInfo}
• Gwarancja/status: ${selectedProduct.description}

ALTERNATYWY:
${altProducts.map((p: any) => `• ${p.name} — ${p.currentPrice} zł netto / szt. [Dostępność: ${p.locationInfo}]`).join("\n")}

DEDYKOWANE UZUPEŁNIENIE OFERTY (Rekomendowane przez asystenta):
${crossSells.filter((c: any) => c.checked).map((c: any) => `• ${c.name} — ${c.price} zł netto.
  Sugerowane zastosowanie: ${c.reason}`).join("\n")}

Abyśmy mieli 100% pewności i mogli zablokować ewentualny zwrot, poproszę o dosłanie numeru VIN pojazdu w odpowiedzi na ten e-mail.

Pozdrawiam serdecznie,
Tomasz Kowalski
Senior Handlowiec B2B · AutoPartner Max S.A.
+48 600 000 000 | tomasz.kowalski@autopartnermax.pl`;
}

// 3. VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Serve with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🚀 [SYSTEM] Vite middleware active in DEVELOPMENT mode.");
  } else {
    // Production static asset serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 [SYSTEM] Serving production static files from dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 [SERVER] AutoPartner Max Quoting Portal live at http://localhost:${PORT}`);
  });
}

startServer();
