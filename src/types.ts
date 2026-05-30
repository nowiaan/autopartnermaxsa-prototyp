export interface Inquiry {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  time: string;
  subject: string;
  body: string;
  status: "new" | "draft" | "sent";
  location: string;
  tags: string[];
  matchedCategory: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  type: "OEM" | "ZAMIENNIK_1" | "ZAMIENNIK_2" | "NIESPRAWDZONY";
  originalPrice: number; // original catalog price
  costPrice: number;     // wholesale buying cost to calculate margin
  currentPrice: number;  // adjustable price after discount
  availState: "in-stock" | "delay" | "out";
  locationInfo: string;
  description: string;
  aiComment?: string;
}

export interface Analysis {
  clientStatus: string;
  brand: string;
  model: string;
  year: string;
  engineCode: string;
  partName: string;
  quantity: number;
  urgency: string;
  expectations: string;
  missingData: string[];
}

export interface CrossSellItem {
  id: string;
  name: string;
  code: string;
  price: number;
  costPrice: number;
  reason: string;
  checked: boolean;
}

export interface MetricSummary {
  adoptionRate: number;
  avgQuotingTimeSec: number;
  savedTimePercent: number;
  marginOkRate: number;
  totalSentOffers: number;
}
