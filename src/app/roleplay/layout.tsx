import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ロープレ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RoleplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
