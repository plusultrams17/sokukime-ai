import { Footer } from "@/components/footer";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Footer />
    </div>
  );
}
