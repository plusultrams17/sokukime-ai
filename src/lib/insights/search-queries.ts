/**
 * Industry-specific search queries for the insights pipeline.
 *
 * Each industry has Google News RSS queries and Semantic Scholar queries
 * designed to surface articles relevant to sales professionals.
 */

export interface IndustryQueries {
  slug: string;
  label_ja: string;
  label_en: string;
  newsQueries: string[];
  scholarQueries: string[];
}

export const INDUSTRIES: IndustryQueries[] = [
  {
    slug: "insurance",
    label_ja: "保険",
    label_en: "Insurance",
    newsQueries: [
      "insurance sales trends 2025",
      "life insurance customer acquisition",
      "insurtech innovation",
    ],
    scholarQueries: [
      "insurance purchase decision psychology",
      "trust building financial services sales",
    ],
  },
  {
    slug: "real-estate",
    label_ja: "不動産",
    label_en: "Real Estate",
    newsQueries: [
      "real estate sales trends Japan",
      "property market buyer psychology",
      "real estate digital transformation",
    ],
    scholarQueries: [
      "real estate purchase decision factors",
      "housing market consumer behavior",
    ],
  },
  {
    slug: "reform",
    label_ja: "リフォーム",
    label_en: "Home Renovation",
    newsQueries: [
      "home renovation market trends",
      "remodeling industry growth",
      "home improvement consumer demand",
    ],
    scholarQueries: [
      "home renovation decision making",
      "construction services customer satisfaction",
    ],
  },
  {
    slug: "exterior-painting",
    label_ja: "外壁塗装",
    label_en: "Exterior Painting",
    newsQueries: [
      "exterior painting industry trends",
      "home maintenance services market",
      "building coating technology",
    ],
    scholarQueries: [
      "home maintenance purchasing behavior",
      "construction services trust factors",
    ],
  },
  {
    slug: "solar",
    label_ja: "太陽光",
    label_en: "Solar Energy",
    newsQueries: [
      "solar energy sales residential",
      "renewable energy market Japan",
      "solar panel installation trends",
    ],
    scholarQueries: [
      "solar adoption decision factors",
      "renewable energy consumer psychology",
    ],
  },
  {
    slug: "automotive",
    label_ja: "自動車",
    label_en: "Automotive",
    newsQueries: [
      "automotive sales trends",
      "car dealership customer experience",
      "EV sales growth consumer behavior",
    ],
    scholarQueries: [
      "automobile purchase decision process",
      "car buyer psychology negotiation",
    ],
  },
  {
    slug: "recruitment",
    label_ja: "人材紹介",
    label_en: "Recruitment",
    newsQueries: [
      "recruitment industry trends",
      "staffing agency sales strategies",
      "talent acquisition market",
    ],
    scholarQueries: [
      "recruitment service buying behavior",
      "B2B sales relationship building",
    ],
  },
  {
    slug: "it-saas",
    label_ja: "IT・SaaS",
    label_en: "IT / SaaS",
    newsQueries: [
      "SaaS sales trends",
      "enterprise software buying behavior",
      "B2B tech sales strategies",
    ],
    scholarQueries: [
      "SaaS adoption decision factors",
      "enterprise software sales psychology",
    ],
  },
  {
    slug: "advertising",
    label_ja: "広告",
    label_en: "Advertising",
    newsQueries: [
      "advertising agency sales trends",
      "digital advertising market growth",
      "ad tech client acquisition",
    ],
    scholarQueries: [
      "advertising service purchase decision",
      "marketing services B2B sales",
    ],
  },
  {
    slug: "medical-devices",
    label_ja: "医療機器",
    label_en: "Medical Devices",
    newsQueries: [
      "medical device sales trends",
      "healthcare technology market",
      "medtech innovation hospital",
    ],
    scholarQueries: [
      "medical device procurement decisions",
      "healthcare product adoption hospital",
    ],
  },
  {
    slug: "printing",
    label_ja: "印刷",
    label_en: "Printing",
    newsQueries: [
      "printing industry digital transformation",
      "commercial printing market trends",
      "print services business model",
    ],
    scholarQueries: [
      "printing services customer retention",
      "B2B service industry sales strategies",
    ],
  },
  {
    slug: "bridal",
    label_ja: "ブライダル",
    label_en: "Bridal / Wedding",
    newsQueries: [
      "wedding industry trends",
      "bridal market customer experience",
      "wedding planning services growth",
    ],
    scholarQueries: [
      "wedding service purchase decision",
      "emotional buying high-involvement services",
    ],
  },
  {
    slug: "saas",
    label_ja: "SaaS",
    label_en: "SaaS",
    newsQueries: [
      "SaaS startup growth strategies",
      "cloud software market trends",
      "SaaS customer onboarding retention",
    ],
    scholarQueries: [
      "SaaS subscription model consumer behavior",
      "cloud software purchasing decisions B2B",
    ],
  },
  {
    slug: "hr",
    label_ja: "人事",
    label_en: "HR Services",
    newsQueries: [
      "HR technology market trends",
      "human resources services sales",
      "talent management solution adoption",
    ],
    scholarQueries: [
      "HR technology adoption organizational",
      "human capital management purchase decision",
    ],
  },
  {
    slug: "education",
    label_ja: "教育",
    label_en: "Education",
    newsQueries: [
      "education industry sales enrollment",
      "edtech market growth",
      "online learning adoption trends",
    ],
    scholarQueries: [
      "educational service purchase decision parents",
      "edtech adoption student engagement",
    ],
  },
  {
    slug: "retail",
    label_ja: "小売",
    label_en: "Retail",
    newsQueries: [
      "retail sales customer experience",
      "omnichannel retail trends",
      "consumer behavior retail psychology",
    ],
    scholarQueries: [
      "retail customer purchase behavior",
      "in-store selling techniques effectiveness",
    ],
  },
];

/** Cross-industry sales psychology queries (fetched once per pipeline run) */
export const GENERAL_SALES_QUERIES = {
  newsQueries: [
    "sales psychology persuasion techniques",
    "B2B sales closing strategies",
    "sales negotiation objection handling",
  ],
  scholarQueries: [
    "sales persuasion psychology closing",
    "objection handling effectiveness sales",
  ],
};
