interface PreviewProps {
  children: React.ReactNode;
  active: boolean;
}

export function Preview({ children, active }: PreviewProps) {
  return (
    <div
      className={`mt-6 rounded-lg border-l-[3px] px-5 py-4 text-sm leading-relaxed transition-all duration-300 ${
        active
          ? "border-[#10B981] bg-[#F0FDF4] text-[#065F46]"
          : "border-[#D1D5DB] bg-[#F9FAFB] text-[#9CA3AF]"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
        {active ? (
          <>
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            AI生成結果
          </>
        ) : (
          <>
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            プレビュー
          </>
        )}
      </div>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
