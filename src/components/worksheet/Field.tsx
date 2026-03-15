"use client";

interface FieldProps {
  label?: string;
  placeholder: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export function Field({
  label,
  placeholder,
  hint,
  value,
  onChange,
  multiline,
}: FieldProps) {
  const inputCls =
    "w-full rounded-lg bg-[#FAFAF8] border border-[#E5E0D8] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8]";
  const isFilled = value.trim().length > 0;

  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
          {label}
        </label>
      )}
      <div className="relative">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} min-h-[88px] resize-y ${isFilled ? "pr-10" : ""}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} ${isFilled ? "pr-10" : ""}`}
          />
        )}
        {isFilled && (
          <span className={`absolute right-3 ${multiline ? "top-3.5" : "top-1/2 -translate-y-1/2"} text-green-500 animate-scale-in`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed italic text-[#9CA3AF]">
          {hint}
        </p>
      )}
    </div>
  );
}
