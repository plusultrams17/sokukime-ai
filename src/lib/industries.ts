// Re-export from the canonical data source for convenience
export {
  industries,
  getIndustryBySlug,
  getAllIndustrySlugs,
  getOtherIndustries,
} from "@/data/industries";
export type { Industry } from "@/data/industries";

import { industries } from "@/data/industries";

export function getAllIndustries() {
  return industries;
}
