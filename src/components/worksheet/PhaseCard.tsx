interface PhaseCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function PhaseCard({ title, description, children }: PhaseCardProps) {
  return (
    <div className="animate-fadeIn mt-6 rounded-[14px] border border-[#E8E4DD] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] sm:p-8">
      <h3 className="mb-1.5 text-lg font-bold text-[#1E293B]">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-[#6B7280]">
        {description}
      </p>
      {children}
    </div>
  );
}
