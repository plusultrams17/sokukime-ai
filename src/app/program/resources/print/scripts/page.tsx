"use client";

interface ScriptSection {
  phase: string;
  color: string;
  description: string;
  scripts: Array<{
    scene: string;
    industry?: string;
    content: string;
    tip: string;
  }>;
}

const scriptSections: ScriptSection[] = [
  {
    phase: "01. アプローチ（第一印象・ラポール形成）",
    color: "#10b981",
    description:
      "お客様の心の扉を開く最初のステップ。褒める・共感する・専門家としての立場を示すことで信頼を獲得します。",
    scripts: [
      {
        scene: "初回訪問の挨拶（訪問販売）",
        industry: "訪販",
        content:
          "「お忙しいところ失礼します。○○の△△と申します。今日は○○様のお宅の前を通らせていただいて、このお庭の手入れの行き届き方に思わず足を止めてしまいました。ご自身で管理されているのですか？」",
        tip: "入り口は「褒め」から。雑談に乗ってくれれば心の扉が開いたサイン。",
      },
      {
        scene: "初回面談の掴み（保険営業）",
        industry: "保険",
        content:
          "「本日はお時間いただきありがとうございます。今日は商品説明ではなく、○○様のこれからの人生設計について一緒に整理させていただくためにお伺いしました。まずは今の暮らしで気になっていること、何でも結構なので聞かせていただけますか？」",
        tip: "「売り込みではない」と最初に伝えることで警戒心が一気に下がる。",
      },
      {
        scene: "初回面談の掴み（不動産）",
        industry: "不動産",
        content:
          "「ご来店ありがとうございます。私、○○担当の△△と申します。今日は物件のご紹介の前に、○○様がどんな暮らしを実現したいのか、じっくりお話を伺えればと思います。お引っ越しを考え始めたきっかけから教えていただけますか？」",
        tip: "物件から入らず「理想の暮らし」から入ると本音が引き出せる。",
      },
      {
        scene: "2度褒めパターン",
        content:
          "営業：「○○様、今日のお洋服とても素敵ですね。」\nお客：「そんなことないですよ。」\n営業：「いえ、本当にそう思います。今まで何百人の方とお会いしてきましたが、ここまでセンス良くまとめている方は珍しいです。」",
        tip: "一度褒めて謙遜されたら、具体例を追加してもう一度褒める。",
      },
    ],
  },
  {
    phase: "02. ヒアリング（ニーズ発掘・課題特定）",
    color: "#3b82f6",
    description:
      "お客様の本音を引き出し、潜在的なニーズや課題を特定します。質問の順序と深掘りが重要です。",
    scripts: [
      {
        scene: "現状確認から始める",
        content:
          "「現在、○○についてはどのように対応されていますか？」\n→「そうなんですね。今のやり方で一番困っていることはありますか？」\n→「その困りごとが解決したら、どんなメリットがありそうですか？」",
        tip: "現状→困りごと→理想の順で質問を深めると、お客様自身がニーズに気づく。",
      },
      {
        scene: "予算感を自然に確認",
        content:
          "「参考までにですが、このような課題を解決するために、これまでにどのくらいコストをかけてこられましたか？」",
        tip: "ストレートに「予算は？」と聞かず、過去実績から予算感を探る。",
      },
      {
        scene: "決裁プロセスを聞く（法人営業）",
        content:
          "「もしこのサービスがピッタリだと感じていただけた場合、社内ではどのような流れで導入を決定されますか？○○様のご判断だけで進められますか、それとも上長の方の承認が必要ですか？」",
        tip: "最後に慌てないよう、商談初期で決裁フローを押さえる。",
      },
      {
        scene: "感情を引き出す質問",
        content:
          "「もしこの課題が解決したら、○○様ご自身はどんな気持ちになりそうですか？」\n「逆に、このまま何も変わらなかったら、1年後どうなっていると思いますか？」",
        tip: "論理ではなく感情を動かすとクロージングがスムーズになる。",
      },
    ],
  },
  {
    phase: "03. プレゼン（価値提案・利点話法）",
    color: "#f97316",
    description:
      "特徴（Feature）ではなく利点（Benefit）で伝えます。お客様にとって「自分ごと」になる表現を選びましょう。",
    scripts: [
      {
        scene: "利点話法（特徴→利点への変換）",
        content:
          "NG：「このサービスはAI搭載です」\nOK：「このサービスはAIが搭載されているので、○○様が毎日2時間かけていた△△の作業が、たった15分で終わるようになります」",
        tip: "「〜なので、○○様にとって△△」の形で語る。",
      },
      {
        scene: "社会的証明の活用",
        content:
          "「実は、○○様と同じ業界で同じような課題を抱えていた□□社様も、最初は半信半疑でした。でも導入から3ヶ月で○○の成果が出て、今では社内全体に展開されています。○○様のお話を聞いていて、□□社様のケースと重なる部分が多いなと感じました。」",
        tip: "似た境遇の第三者事例を出すと「自分にもできそう」と思ってもらえる。",
      },
      {
        scene: "3点提示法",
        content:
          "「○○様にとってこのサービスの価値は、大きく3つあります。\n1つ目は△△、2つ目は□□、そして3つ目は◇◇です。\nこの中で、○○様が特に魅力を感じるのはどれですか？」",
        tip: "情報を3つに絞ることで記憶に残りやすく、質問で相手を巻き込める。",
      },
      {
        scene: "ネガティブな側面も正直に",
        content:
          "「正直にお話しすると、このサービスは○○の点ではまだ改善中です。ただ、△△が最優先の○○様にとっては、そこは大きな問題にならないと思います。むしろ□□の面で大きなメリットを感じていただけるはずです。」",
        tip: "あえて短所を語ると信頼度が上がる「両面提示」のテクニック。",
      },
    ],
  },
  {
    phase: "04. クロージング（決断の後押し）",
    color: "#8b5cf6",
    description:
      "曖昧にせず、明確に「契約してください」と言い切ります。自信を持った訴求がお客様の不安を取り除きます。",
    scripts: [
      {
        scene: "仮定クロージング",
        content:
          "「仮にこのサービスを導入するとしたら、開始は○月と△月、どちらがご都合よろしいですか？」",
        tip: "YES/NOではなく「選択肢」で聞くと、導入を前提とした思考になる。",
      },
      {
        scene: "テストクロージング",
        content:
          "「ここまでご説明してきましたが、○○様の率直なご感想はいかがですか？」\n→反応を見て次のアクションを決める。",
        tip: "本クロージングの前に、反応を見る「ジャブ」を入れる。",
      },
      {
        scene: "ポジティブクロージング",
        content:
          "「○○様、任せてください。このサービスで○○様の課題は必ず解決できます。今日、一緒に始めましょう。」",
        tip: "自信を持って言い切る。「どうしますか？」は絶対NG。",
      },
      {
        scene: "ネガティブクロージング（希少性活用）",
        content:
          "「今月は○名様限定のキャンペーン価格でご案内できます。来月からは通常価格に戻ってしまうので、もし少しでも迷われているなら、今日決めていただくことを強くおすすめします。」",
        tip: "希少性と緊急性は決断を後押しする強力な武器。",
      },
      {
        scene: "沈黙のクロージング",
        content: "「（契約書を差し出しながら）ではこちらにご署名をお願いします。」\n→言ったら黙る。",
        tip: "言葉を重ねず、相手に決断の時間を与える。沈黙こそ最強の武器。",
      },
    ],
  },
  {
    phase: "05. 反論処理（切り返し）",
    color: "#ef4444",
    description:
      "反論は「断り」ではなく「まだ納得していないサイン」。共感→フック→切り返しの公式で対応します。",
    scripts: [
      {
        scene: "公式: 共感→フック→切り返し",
        content:
          "共感：「おっしゃる通りですよね、そう感じるのは自然だと思います。」\nフック：「実は、○○様と同じように感じられた□□様が、△△というきっかけで導入を決められました。」\n切り返し：「その△△というのが、実はこのサービスの一番の価値なんです。もう少し詳しくお話ししてもいいですか？」",
        tip: "反論をいきなり否定せず、まず受け止める。共感が信頼を作る。",
      },
      {
        scene: "「高い」への切り返し",
        content:
          "「『高い』と感じられるのは当然だと思います。ちなみに、何と比較して高いと感じられましたか？もし『価格と価値のバランス』の話であれば、今一度ご説明させてください。」",
        tip: "「高い」の基準を確認することで、価値の再提示につなげる。",
      },
      {
        scene: "「検討します」への切り返し",
        content:
          "「もちろんです。ただ、検討される中で気になっている点を今お聞きできれば、その場でお答えできるかもしれません。一番引っかかっている点は何ですか？」",
        tip: "「検討します」の裏の本音を引き出さないと、永遠に保留される。",
      },
    ],
  },
];

export default function PrintScriptsPage() {
  return (
    <article className="print-prose">
      {/* Cover */}
      <header className="mb-8 border-b-4 border-blue-500 pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
          成約コーチAI 教材プログラム
        </p>
        <h1>
          トークスクリプト集
          <br />
          <span className="text-blue-600">5フェーズ完全版</span>
        </h1>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          アプローチからクロージング・反論処理まで、営業の全フェーズで使える実践トークスクリプト集。訪販・保険・不動産の業種別例も収録。
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
          <span className="font-bold">{scriptSections.length}フェーズ</span>
          <span>|</span>
          <span>業種別カスタマイズ例付き</span>
          <span>|</span>
          <span>そのまま使える実例</span>
        </div>
      </header>

      {/* Table of Contents */}
      <section className="print-avoid-break mb-10 rounded-lg bg-gray-50 p-5">
        <h2
          className="!mt-0 !border-none !pb-0 text-blue-600"
          style={{ fontSize: "14pt" }}
        >
          目次
        </h2>
        <ol className="mt-3 !pl-0 !list-none space-y-1.5">
          {scriptSections.map((section) => (
            <li key={section.phase} className="!mb-0 text-sm">
              <span className="font-bold text-gray-900">{section.phase}</span>
              <span className="ml-2 text-[9.5pt] text-gray-500">
                （{section.scripts.length}スクリプト）
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sections */}
      {scriptSections.map((section, sIdx) => (
        <section
          key={section.phase}
          className={sIdx > 0 ? "print-page-break" : ""}
        >
          <header className="mb-5">
            <h2 className="!mt-2" style={{ color: section.color }}>
              {section.phase}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {section.description}
            </p>
          </header>

          {section.scripts.map((script, scriptIdx) => (
            <div
              key={scriptIdx}
              className="print-avoid-break mb-5 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10pt] font-bold text-white"
                  style={{ backgroundColor: section.color }}
                >
                  {scriptIdx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="!mt-0 !mb-1 !text-[12pt]">{script.scene}</h3>
                  {script.industry && (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[9pt] font-medium text-gray-600">
                      業種: {script.industry}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3 rounded bg-gray-50 p-3">
                <p className="!mb-0 whitespace-pre-line text-[10pt] leading-relaxed text-gray-800">
                  {script.content}
                </p>
              </div>

              <div className="rounded bg-amber-50 p-2.5">
                <p className="!mb-0 text-[9pt] text-amber-900">
                  <strong>💡 ポイント:</strong> {script.tip}
                </p>
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
        <p className="text-[9pt] text-gray-500">
          © 成約コーチAI — トークスクリプト集 5フェーズ完全版
        </p>
        <p className="mt-1 text-[9pt] text-gray-500">
          https://seiyaku-coach.vercel.app
        </p>
      </footer>
    </article>
  );
}
