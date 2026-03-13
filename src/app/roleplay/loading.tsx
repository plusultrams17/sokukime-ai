export default function RoleplayLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold text-white animate-pulse">
          ロープレ準備中...
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-gray-500 text-sm">AIコーチを起動しています</p>
      </div>
    </div>
  );
}
