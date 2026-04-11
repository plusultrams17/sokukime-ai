import Link from "next/link";

/**
 * Pro plan CTA shown after free tool completion.
 * Encourages users to upgrade to Pro for the full program.
 */
export function ProgramUpsellCTA() {
  return (
    <div className="rounded-2xl border-2 border-accent bg-accent/5 p-6 text-center sm:p-8">
      <p className="mb-2 text-sm font-medium text-accent">スコアを伸ばしたい方へ</p>
      <h3 className="mb-3 text-xl font-bold text-foreground">
        Proプランで22レッスン全解放
      </h3>
      <p className="mb-4 text-sm text-muted leading-relaxed">
        22レッスンで営業の「型」を体系的に習得。AIロープレ月60回・PDF教材・反論切り返し30パターンすべて使い放題。
      </p>
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-2xl font-bold text-accent">¥1,980</span>
        <span className="text-xs text-muted">/月（税込）</span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">Freeで5回お試し可能</span>
      </div>
      <Link
        href="/pricing"
        className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
      >
        Proプランの詳細を見る
      </Link>
    </div>
  );
}

/**
 * Upsell CTA shown after free tool completion.
 * Encourages users to try Pro via AI roleplay.
 */
export function ToolUpsellCTA() {
  return (
    <div className="space-y-6">
      <ProgramUpsellCTA />
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center sm:p-8">
        <h3 className="mb-2 text-lg font-bold text-foreground">
          診断結果を実践で活かしませんか？
        </h3>
        <p className="mb-5 text-sm text-muted">
          AIロープレなら、弱点をピンポイントで練習できます。
          <br className="hidden sm:block" />
          Proプランなら月60回まで。¥1,980/月でいつでも解約OK。
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/roleplay"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-7 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            無料でAIロープレを試す
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-accent/30 bg-white px-7 text-sm font-bold text-accent transition hover:bg-accent/5"
          >
            Proプランを見る
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted">
          &#10003; 登録不要で体験OK &#10003; Starter ¥990〜 / Pro ¥1,980 &#10003; いつでも解約可能
        </p>
      </div>
    </div>
  );
}
