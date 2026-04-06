import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const entries = Object.entries(params).flatMap(([key, val]) => {
    if (val === undefined) return [];
    if (Array.isArray(val)) return val.map((v) => [key, v] as [string, string]);
    return [[key, val] as [string, string]];
  });
  const qs = new URLSearchParams(entries).toString();
  redirect(`/login${qs ? `?${qs}` : ""}`);
}
