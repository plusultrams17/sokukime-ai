export default function TryRoleplayLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      style={{ background: "#f0e4d4" }}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
        style={{ borderColor: "#f48a58", borderTopColor: "transparent" }}
      />
      <p
        className="text-sm font-bold"
        style={{ color: "#4d4c4a" }}
      >
        ロープレ体験を準備中...
      </p>
    </div>
  );
}
