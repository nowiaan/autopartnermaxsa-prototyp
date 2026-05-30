import { Inquiry, Product, Analysis, CrossSellItem } from "../types";

export const initialInquiries: Inquiry[] = [
  {
    id: "inq_1",
    clientName: "Marek Wójcik",
    companyName: "Warsztat Samochodowy Marek Wójcik",
    email: "marek.wojcik@warsztat-wojcik.pl",
    time: "09:42",
    subject: "Zapytanie — pompa paliwa Ford Focus 2015 1.6 diesel",
    body: `Dzień dobry,

Potrzebuję pilnie pompy paliwa do Forda Focusa rocznik 2015, silnik 1.6 diesel. Mam auto na podnośniku, klient czeka na odbiór jutro rano.

Proszę o informację o cenie, dostępności i czy macie też zamiennik tańszy w przyzwoitej jakości — klient pyta o opcje. Chciałbym dostać odpowiedź w miarę szybko, bo jak się nie wyrobicie, to muszę szukać gdzie indziej.

Dzięki,
Marek`,
    status: "new",
    location: "Kraków, ul. Wadowicka 14",
    tags: ["B2B", "Warsztat", "Pilne"],
    matchedCategory: "Pompy paliwa"
  },
  {
    id: "inq_2",
    clientName: "Janusz Kowal",
    companyName: "AutoFix Sp. z o.o.",
    email: "zakupy@autofix-krakow.pl",
    time: "09:15",
    subject: "Wycena klocków hamulcowych Audi A4 B8 - 4 kpl",
    body: `Cześć Tomek,

Rzuć okiem na szybko na cenę klocków hamulcowych na tył do Audi A4 B8 2.0 TDI (2012 rok). Potrzebuję 4 komplety tej samej marki bo realizuję serwis floty dla lokalnej taksówki.

Zależy mi na stabilnej marce (Ate lub TRW) i ewentualnie czymś tańszym na rezerwę (np. Kamoka / Denckermann), jeśli różnica w cenie przekracza 40%. Towar muszę mieć dzisiaj albo jutro o świcie.

Pozdrawiam,
Janusz`,
    status: "draft",
    location: "Kraków, ul. Zakopiańska 9",
    tags: ["Flota", "Rabat Ilościowy", "Klocki"],
    matchedCategory: "Klocki hamulcowe"
  },
  {
    id: "inq_3",
    clientName: "Piotr Zieliński",
    companyName: "Warsztat Premium & Detailing",
    email: "serwis@warsztatpremium.pl",
    time: "08:51",
    subject: "Hurtowe zamówienie filtrów oleju - zamówienie cykliczne B2B",
    body: `Dzień dobry,

W związku z uruchomieniem nowej linii serwisowej pod floty korporacyjne, planujemy cykliczne zaopatrzenie w filtry oleju marki Knecht, Mann lub Bosch. 

Na ten moment na pierwszy rzut poproszę o wycenę 20 sztuk filtrów oleju do silników VW 2.0 TDI (grupa VAG, lata 2015-2022). Jaki rabat ilościowy jesteście w stanie zaproponować przy stałej współpracy? 

Wysłanie bezpośrednio na nasz magazyn centralny.

Z poważaniem,
Piotr Zieliński
Dyrektor ds. Zakupów`,
    status: "new",
    location: "Katowice, ul. Chorzowska 102",
    tags: ["Hurt", "Cykliczne", "VAG"],
    matchedCategory: "Filtry oleju"
  },
  {
    id: "inq_4",
    clientName: "Zbigniew Nowak",
    companyName: "Mechanik24 Całodobowy",
    email: "kontakt@mechanik24h.pl",
    time: "08:30",
    subject: "Pompa wody Skoda Octavia II 1.9 TDI 2008r",
    body: `Witam,

Potrzebna pompa wody do legendarnej Octavii dwójki, silnik 1.9 TDI, 105 koni, rocznik 2008. Auto rozebrane u nas na warsztacie, stara pompa przecieka na osi. 

Dajcie dobrą cenę za samą pompę, a dodatkowo, jeśli macie zestaw z pasem rozrządu i napinaczem w dobrej cenie łączonej (jakiś komplet Gates / SKF) to chętnie wezmę cały zestaw, bo i tak trzeba ten rozrząd zaraz zmieniać, to namówię klienta na komplet.

Sprawa pilna, kierowca od nas może podjechać po odbiór bezpośrednio.

Z poważaniem,
Zbigniew Nowak`,
    status: "sent",
    location: "Kraków, ul. Jasnogórska 45",
    tags: ["Warsztat", "Pakiet", "Pilne"],
    matchedCategory: "Pompy wody i Rozrządy"
  },
  {
    id: "inq_5",
    clientName: "Andrzej Grabowski",
    companyName: "Grabowski Trans Logistics",
    email: "a.grabowski@grabowskitrans.pl",
    time: "Wczoraj, 16:42",
    subject: "Zapytanie części Scania R420 2011 — Tarcze tył + klocki",
    body: `Szanowni Państwo,

Poszukujemy tarcz hamulcowych na oś tylną (lewa + prawa) oraz kompletu klocków hamulcowych do ciągnika siodłowego Scania R420, rocznik 2011.

Proszę o ofertę na podzespoły marki Textar, Haldex lub ewentualnie marki własnej AutoPartner jeśli posiadacie w segmencie Heavy Duty o certyfikowanej trwałości. Jesteśmy dużym płatnikiem, interesuje nas wydłużony termin płatności 30 dni.

Proszę o kontakt zwrotny oferty.

Grabowski Andrzej`,
    status: "sent",
    location: "Tarnów, ul. Przemysłowa 3",
    tags: ["Truck B2B", "Floty", "Tarcze Tył"],
    matchedCategory: "Części Ciężarowe (Heavy Duty)"
  }
];

export const initialAnalyses: Record<string, Analysis> = {
  inq_1: {
    clientStatus: "Warsztat Marek Wójcik · Aktywny VIP (CRM: #6822)",
    brand: "Ford",
    model: "Focus Mk3",
    year: "2015",
    engineCode: "1.6 TDCi (diesel)",
    partName: "Pompa paliwa",
    quantity: 1,
    urgency: "Bardzo wysoka (samochód na podnośniku, klient czeka)",
    expectations: "Porównanie opcji: oryginał vs tańszy, trwały zamiennik",
    missingData: ["VIN pojazdu", "Pełny kod silnika z dowodu (T1DA lub T1DB)"]
  },
  inq_2: {
    clientStatus: "AutoFix Sp. z o.o. · Partner Flotowy (CRM: #4511)",
    brand: "Audi",
    model: "A4 B8",
    year: "2012",
    engineCode: "2.0 TDI",
    partName: "Klocki hamulcowe tył",
    quantity: 4,
    urgency: "Wysoka (odbiór dziś lub jutro rano)",
    expectations: "Opcja premium (Ate/TRW) vs budżet (różnica >40%), rabat ilościowy",
    missingData: ["VIN w celu weryfikacji średnicy tarczy (288mm vs 300mm)"]
  },
  inq_3: {
    clientStatus: "Warsztat Premium & Detailing · Stała współpraca (CRM: #1219)",
    brand: "VW (Grupa VAG)",
    model: "Wiele pojazdów z silnikiem 2.0 TDI",
    year: "2015-2022",
    engineCode: "2.0 TDI (CR)",
    partName: "Filtr oleju (Hurt)",
    quantity: 20,
    urgency: "Średnia (zamówienie magazynowe cykliczne)",
    expectations: "Marki Knecht/Mann/Bosch, stały upust hurtowy, propozycja umowy flotowej",
    missingData: ["Potwierdzenie kodów filtracji (HU 7020 z / HU 7008 z itp.)"]
  },
  inq_4: {
    clientStatus: "Mechanik24 Całodobowy · Stały warsztat (CRM: #3312)",
    brand: "Skoda",
    model: "Octavia II",
    year: "2008",
    engineCode: "1.9 TDI (105 KM, np. BXE / BLS)",
    partName: "Pompa wody",
    quantity: 1,
    urgency: "Krytyczna (auto rozebrane w locie)",
    expectations: "Dobra cena pompy wody + propozycja pełnego zestawu rozrządu (upsell)",
    missingData: ["Oznaczenie silnika (BXE bez DPF / BLS z DPF) w celu dobrania paska"]
  },
  inq_5: {
    clientStatus: "Grabowski Trans Logistics · Duży klient Truck (CRM: #1008)",
    brand: "Scania",
    model: "R420 Truck",
    year: "2011",
    engineCode: "DC12 15 (420 KM)",
    partName: "Tarcze hamulcowe tył + klocki",
    quantity: 2,
    urgency: "Wysoka (flota handlowa)",
    expectations: "Textar/Haldex lub marka własna HD, kredyt kupiecki silnika (30 dni płatności)",
    missingData: ["Wymiar tarczy hamulcowej (410mm vs 430mm)", "Numer podwozia Scania"]
  }
};

export const initialProducts: Record<string, Product[]> = {
  inq_1: [
    {
      id: "prod_1_1",
      name: "Pompa paliwa Ford OEM oryginalna",
      code: "1863544 · indeks AP 1234567",
      category: "Pompy paliwa",
      type: "OEM",
      originalPrice: 850,
      costPrice: 580,
      currentPrice: 850,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Północ · 4 szt.",
      description: "Fabryczna część oryginalna o najwyższej trwałości. Gwarancja fabryczna 2 lata."
    },
    {
      id: "prod_1_2",
      name: "Pompa Bosch 0 580 464 038",
      code: "Bosch 0580464038 · indeks AP 2245189",
      category: "Pompy paliwa",
      type: "ZAMIENNIK_1",
      originalPrice: 420,
      costPrice: 240,
      currentPrice: 420,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 8 szt.",
      description: "Kwalifikacja jakościowa Q (Oryginalny dostawca na taśmę). Rekomendacja AI.",
      aiComment: "Najlepszy balans marży (43%) i renomy marki Bosch. Bardzo rzadkie reklamacje."
    },
    {
      id: "prod_1_3",
      name: "Pompa Valeo 347129",
      code: "Valeo 347129 · indeks AP 3340022",
      category: "Pompy paliwa",
      type: "ZAMIENNIK_2",
      originalPrice: 320,
      costPrice: 220,
      currentPrice: 320,
      availState: "delay",
      locationInfo: "Magazyn Centralny Bieruń · 2 dni",
      description: "Dobra półka średnia, popularny produkt w warsztatach niezależnych."
    },
    {
      id: "prod_1_4",
      name: "AutoXparts AX-FP-12 EcoLine",
      code: "AutoXparts AX-FP-12 · indeks AP 4501887",
      category: "Pompy paliwa",
      type: "NIESPRAWDZONY",
      originalPrice: 180,
      costPrice: 155,
      currentPrice: 180,
      availState: "out",
      locationInfo: "Brak na stanie (Dostawa: 5-7 dni)",
      description: "Tani zamiennik budżetowy. Niska marża kwotowa i wyższa stopowość reklamacyjna."
    }
  ],
  inq_2: [
    {
      id: "prod_2_1",
      name: "Klocki hamulcowe ATE Ceramic tył",
      code: "13.0470-2880.2 · indeks AP 119280",
      category: "Klocki hamulcowe",
      type: "OEM",
      originalPrice: 260,
      costPrice: 170,
      currentPrice: 260,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Północ · 12 szt.",
      description: "Premium klocki bezpyłowe o ekstremalnej trwałości, świetne do taksówek."
    },
    {
      id: "prod_2_2",
      name: "Klocki TRW GDB1128 z akcesoriami",
      code: "GDB1128 · indeks AP 924510",
      category: "Klocki hamulcowe",
      type: "ZAMIENNIK_1",
      originalPrice: 185,
      costPrice: 110,
      currentPrice: 185,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 20 szt.",
      description: "Klocki klasy premium, sprawdzona żywotność. Rekomendacja pod flotę B2B.",
      aiComment: "Znakomita marża (41%) oraz natychmiastowy odbiór."
    },
    {
      id: "prod_2_3",
      name: "Klocki Kamoka JQ10114",
      code: "JQ10114 · indeks AP 88204",
      category: "Klocki hamulcowe",
      type: "ZAMIENNIK_2",
      originalPrice: 95,
      costPrice: 55,
      currentPrice: 95,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 30 szt.",
      description: "Ekonomiczny polski producent. Spełnia normy ECE R90, dobra opcja oszczędnościowa."
    }
  ],
  inq_3: [
    {
      id: "prod_3_1",
      name: "Filtr oleju Knecht OX 188D Eco",
      code: "OX188D · indeks AP 992451",
      category: "Filtry oleju",
      type: "OEM",
      originalPrice: 42,
      costPrice: 21,
      currentPrice: 42,
      availState: "in-stock",
      locationInfo: "Kraków: 50szt. / Bieruń: 300szt.",
      description: "Najwyższy rygor filtracyjny OEM w Grupie Volkswagen. Marka premium koncernu Mahle.",
      aiComment: "Rekomendowane pod cykliczną obsługę flot. Świetna marża procentowa (50%)"
    },
    {
      id: "prod_3_2",
      name: "Filtr oleju Mann-Filter HU 7020 z",
      code: "HU7020z · indeks AP 552102",
      category: "Filtry oleju",
      type: "ZAMIENNIK_1",
      originalPrice: 38,
      costPrice: 20,
      currentPrice: 38,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 40 szt.",
      description: "Niemiecki lider filtracji fabrycznej. Standard w autoryzowanych warsztatach."
    },
    {
      id: "prod_3_3",
      name: "Filtr oleju Bosch P7188",
      code: "1 457 429 188 · indeks AP 102451",
      category: "Filtry oleju",
      type: "ZAMIENNIK_2",
      originalPrice: 32,
      costPrice: 19,
      currentPrice: 32,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 15 szt.",
      description: "Klasa jakościowa Q, pewność poprawności gniazda i pasowania uszczelki."
    }
  ],
  inq_4: [
    {
      id: "prod_4_1",
      name: "Zestaw rozrządu z pompą wody SKF VKMC 01148-2",
      code: "VKMC 01148-2 · indeks AP 441092",
      category: "Pompy wody i Rozrządy",
      type: "OEM",
      originalPrice: 510,
      costPrice: 340,
      currentPrice: 510,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Północ · 3 kpl.",
      description: "Kompletny zestaw rozrządu z paskiem wzmacnianym teflonem, napinaczem i pompą wody. Najniższe ryzyko.",
      aiComment: "Idealny do upsella! Warsztat pytał o oszczędność, a my proponujemy gotowy zestaw w świetnej cenie."
    },
    {
      id: "prod_4_2",
      name: "Pompa wody Gates WP0056",
      code: "WP0056 · indeks AP 502120",
      category: "Pompy wody i Rozrządy",
      type: "ZAMIENNIK_1",
      originalPrice: 170,
      costPrice: 95,
      currentPrice: 170,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 12 szt.",
      description: "Samodzielna pompa wody z metalowym wirnikiem o podwyższonej odporności na kawitację."
    },
    {
      id: "prod_4_3",
      name: "Pompa wody Dolz A202",
      code: "A-202 · indeks AP 101142",
      category: "Pompy wody i Rozrządy",
      type: "ZAMIENNIK_2",
      originalPrice: 110,
      costPrice: 70,
      currentPrice: 110,
      availState: "in-stock",
      locationInfo: "Magazyn Kraków Centralny · 9 szt.",
      description: "Dobra pompa hiszpańskiego wyspecjalizowanego producenta. Jakość bazowa."
    }
  ],
  inq_5: [
    {
      id: "prod_5_1",
      name: "Tarcza hamulcowa Textar Truck Heavy Duty (para)",
      code: "93121500 · indeks AP 889104",
      category: "Części Ciężarowe (Heavy Duty)",
      type: "OEM",
      originalPrice: 1250,
      costPrice: 850,
      currentPrice: 1250,
      availState: "in-stock",
      locationInfo: "Dział Ciężarowy Kraków Rybitwy · 2 szt.",
      description: "Ciężka tarcza z odlewu wysokowęglowego (High Carbon). Niskie wibracje pod ciągłym obciążeniem 40 ton."
    },
    {
      id: "prod_5_2",
      name: "Klocki hamulcowe Textar Heavy Duty tył",
      code: "2912501 · indeks AP 889105",
      category: "Części Ciężarowe (Heavy Duty)",
      type: "ZAMIENNIK_1",
      originalPrice: 530,
      costPrice: 340,
      currentPrice: 530,
      availState: "in-stock",
      locationInfo: "Dział Ciężarowy Kraków Rybitwy · 4 kpl.",
      description: "Klocki z zestawem montażowym (sprężyny, blaszki). Optymalnie zgrane z tarcza Textar.",
      aiComment: "Rekomendujemy łączną ofertę na tarcze + klocki z marżą ok. 35%. Bardzo duża wartość koszyka."
    },
    {
      id: "prod_5_3",
      name: "Tarcze hamulcowe MaXgear Truck Tył (para)",
      code: "MG-T-5412 · indeks AP 44109",
      category: "Części Ciężarowe (Heavy Duty)",
      type: "ZAMIENNIK_2",
      originalPrice: 790,
      costPrice: 580,
      currentPrice: 790,
      availState: "delay",
      locationInfo: "Dostawa z Katowic (1 dzień)",
      description: "Budżetowy i sprawdzony pakiet dla starszych naczep i ciągników."
    }
  ]
};

export const initialCrossSells: Record<string, CrossSellItem[]> = {
  inq_1: [
    {
      id: "cs_1_1",
      name: "Filtr paliwa Bosch F 026 402 067",
      code: "F026402067",
      price: 65,
      costPrice: 35,
      reason: "Klient nie wymieniał filtra paliwa przy ostatnich 2 wizytach w serwisie.",
      checked: true
    },
    {
      id: "cs_1_2",
      name: "Śrubunek mocowania przewodu paliwowego OEM",
      code: "135602",
      price: 18,
      costPrice: 5,
      reason: "Często ulega pęknięciu podczas demontażu pompy paliwa Ford Focus.",
      checked: false
    }
  ],
  inq_2: [
    {
      id: "cs_2_1",
      name: "Płyn hamulcowy ATE SL.6 DOT4 1L",
      code: "03.9901-6402.2",
      price: 45,
      costPrice: 20,
      reason: "Sugerowany upust przy komplecie 4 kompletów klocków do taksówek miejskich.",
      checked: true
    },
    {
      id: "cs_2_2",
      name: "Czujnik zużycia klocków tył TRW",
      code: "GIC345",
      price: 25,
      costPrice: 12,
      reason: "Wymagany przy wymianie klocków w Audi A4 B8, ulega stopieniu.",
      checked: true
    }
  ],
  inq_3: [
    {
      id: "cs_3_1",
      name: "Korek spustowy miski olejowej z uszczelką VAG (opak. 10 szt.)",
      code: "N90813202",
      price: 49,
      costPrice: 15,
      reason: "Konieczny do wymiany przy każdej zmianie oleju w silnikach 2.0 TDI.",
      checked: true
    },
    {
      id: "cs_3_2",
      name: "Zmywacz do hamulców i sprzęgieł MaXgear 500ml",
      code: "MG-BC-500",
      price: 11,
      costPrice: 5,
      reason: "Standardowy preparat warsztatowy stosowany przy wymianach eksploatacyjnych.",
      checked: false
    }
  ],
  inq_4: [
    {
      id: "cs_4_1",
      name: "Płyn chłodniczy silnika G12+ Febi 1.5L",
      code: "01381",
      price: 32,
      costPrice: 16,
      reason: "Przy wymianie pompy wody ubywa ok. 3-4 litrów płynu chłodniczego.",
      checked: true
    },
    {
      id: "cs_4_2",
      name: "Zimering wału korbowego przedni Elring",
      code: "325.150",
      price: 28,
      costPrice: 11,
      reason: "Warsztaty zalecają wymianę przy rozebranym rozrządzie 1.9 TDI.",
      checked: false
    }
  ],
  inq_5: [
    {
      id: "cs_5_1",
      name: "Czujnik zużycia klocków hamulcowych Scania Haldex",
      code: "HDX-29125",
      price: 68,
      costPrice: 30,
      reason: "Zapewnia prawidłową współpracę systemu ESP ciągnika.",
      checked: true
    }
  ]
};
