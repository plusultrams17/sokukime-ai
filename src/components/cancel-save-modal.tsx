"use client";

import { useState } from "react";

interface CancelSaveModalProps {
  open: boolean;
  onClose: () => void;
  onProceedToCancel: () => void;
}

const cancelReasons = [
  "料金が高い",
  "あまり使っていない",
  "効果を感じない",
  "他のツールを使っている",
  "その他",
];

export function CancelSaveModal({ open, onClose, onProceedToCancel }: CancelSaveModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  if (!open) return null;

  function handleSelectReason(reason: string) {
    setSelectedReason(reason);
    setStep(2);
  }

  function handleClose() {
    setStep(1);
    setSelectedReason(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8">
        {step === 1 && (
          <>
            <h2 className="mb-2 text-center text-lg font-bold">解約の理由を教えてください</h2>
            <p className="mb-6 text-center text-sm text-muted">
              今後の改善に役立てさせていただきます
            </p>
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleSelectReason(reason)}
                  className="flex w-full items-center rounded-xl border border-card-border px-4 py-3 text-sm text-muted transition hover:border-accent/50 hover:text-foreground"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={handleClose}
              className="mt-4 w-full text-center text-sm text-muted transition hover:text-foreground"
            >
              やっぱりやめる
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4 text-center text-4xl">🎁</div>
            <h2 className="mb-2 text-center text-lg font-bold">特別オファー</h2>
            <p className="mb-6 text-center text-sm text-muted">
              解約前に、特別価格をご用意しました
            </p>

            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
              <div className="mb-1 text-xs text-muted">次月のお支払い</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-muted line-through">¥2,980</span>
                <span className="text-2xl font-black text-accent">¥1,490</span>
              </div>
              <div className="mt-1 text-xs text-accent font-medium">50% OFF</div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleClose}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
              >
                特別価格で続ける
              </button>
              <button
                onClick={() => {
                  handleClose();
                  onProceedToCancel();
                }}
                className="text-sm text-muted transition hover:text-foreground"
              >
                それでも解約する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
