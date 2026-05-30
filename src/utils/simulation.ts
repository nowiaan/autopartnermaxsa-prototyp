import { Analysis } from "../types";

export function localSimulateAnalysis(body: string): Analysis {
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

export function localSimulateEmail(params: any): string {
  const { clientName, companyName, selectedProduct, altProducts = [], crossSells = [], language = "pl" } = params;

  if (language === "en") {
    return `Hello ${clientName},

Thank you for your B2B inquiry for ${companyName || "your workshop"}. Please find our official proposal below:

RECOMMENDED PART (Best Quality & Value):
• ${selectedProduct ? selectedProduct.name : "Part"} - ${selectedProduct ? selectedProduct.currentPrice : 0} PLN net
• Part code: ${selectedProduct ? selectedProduct.code : "N/A"}
• Availability: ${selectedProduct ? selectedProduct.locationInfo : "In Stock"}
• Note: ${selectedProduct ? selectedProduct.description : ""}

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

vielen Dank für Ihre B2B-Anfrage für ${companyName || "Ihre Werkstatt"}. Hier ist unser Angebot:

EMPFOHLENE OPTION:
• ${selectedProduct ? selectedProduct.name : "Teil"} - ${selectedProduct ? selectedProduct.currentPrice : 0} PLN netto
• Teilenummer: ${selectedProduct ? selectedProduct.code : "N/A"}
• Verfügbarkeit: ${selectedProduct ? selectedProduct.locationInfo : "Auf Lager"}
• Details: ${selectedProduct ? selectedProduct.description : ""}

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
• ${selectedProduct ? selectedProduct.name : "Część"} — ${selectedProduct ? selectedProduct.currentPrice : 0} zł netto / szt.
• Kod części/indeks: ${selectedProduct ? selectedProduct.code : "N/A"}
• Dostępność: ${selectedProduct ? selectedProduct.locationInfo : "Na stanie"}
• Gwarancja/status: ${selectedProduct ? selectedProduct.description : ""}

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
