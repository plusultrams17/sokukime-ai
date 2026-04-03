/* Shared IndustryIcon component — used by page.tsx & industry-quick-value.tsx */

export function IndustryIcon({ name }: { name: string }) {
  const p = { className: "h-6 w-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (name) {
    case "塗装":
      return <svg {...p}><rect x="3" y="2" width="18" height="8" rx="1.5" /><path d="M12 10v8" /><path d="M8 21h8" /></svg>;
    case "リフォーム":
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "不動産":
      return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="1.5" /><path d="M9 22V12h6v10" /><circle cx="8" cy="6" r=".5" fill="currentColor" /><circle cx="16" cy="6" r=".5" fill="currentColor" /><circle cx="8" cy="9" r=".5" fill="currentColor" /><circle cx="16" cy="9" r=".5" fill="currentColor" /></svg>;
    case "保険":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "SaaS":
      return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>;
    case "人材":
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "教育":
      return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
    case "物販":
      return <svg {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
    default:
      return null;
  }
}
