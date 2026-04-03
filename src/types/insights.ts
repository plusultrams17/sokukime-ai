export interface Insight {
  id: string;
  source_type: "news" | "research";
  source_name: string;
  source_url: string;
  title_ja: string;
  summary_ja: string;
  sales_angle: string;
  title_en?: string;
  industries: string[];
  tags: string[];
  reading_time_min: number;
  published_date: string;
  created_at: string;
}

export interface SalesTalkPattern {
  type: "approach" | "presentation" | "objection";
  title: string;
  content: string;
}

export interface InsightUsage {
  viewedToday: number;
  limit: number;
  plan: string;
}
