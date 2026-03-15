interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
}

export function SectionLabel({ children, color }: SectionLabelProps) {
  return (
    <div
      className="mb-4 mt-8 flex items-center gap-2 border-b pb-2 text-xs font-bold tracking-wider first:mt-0"
      style={{
        borderColor: color ? `${color}25` : "#E5E0D8",
        color: color || "#6B7280",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color || "#6B7280" }}
      />
      {children}
    </div>
  );
}
