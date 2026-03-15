"use client";

interface AIButtonProps {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
}

export function AIButton({ onClick, loading, children }: AIButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-5 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0"
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )}
      {loading ? "生成中..." : children}
    </button>
  );
}
