"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  memberCount: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  memberCount: "",
  message: "",
};

const MEMBER_OPTIONS = [
  "5-9名",
  "10-29名",
  "30-49名",
  "50名以上",
] as const;

export function EnterpriseLeadForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.companyName.trim() || !form.contactName.trim() || !form.email.trim()) {
      setError("会社名、担当者名、メールアドレスは入力必須です。");
      return;
    }

    if (!form.email.includes("@")) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          source: `enterprise_lp|${form.companyName}|${form.contactName}|${form.phone}|${form.memberCount}|${form.message}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "送信に失敗しました");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "送信に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-600/30 bg-green-600/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600/10">
          <svg
            className="h-7 w-7 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold">
          お問い合わせを受け付けました
        </h3>
        <p className="text-sm text-muted">
          担当者より1営業日以内にご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-card-border bg-card p-6 sm:p-8"
    >
      <div className="space-y-5">
        {/* Company Name */}
        <div>
          <label
            htmlFor="companyName"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            会社名 <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={form.companyName}
            onChange={handleChange}
            placeholder="株式会社サンプル"
            className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Contact Name */}
        <div>
          <label
            htmlFor="contactName"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            ご担当者名 <span className="text-red-500">*</span>
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            value={form.contactName}
            onChange={handleChange}
            placeholder="山田 太郎"
            className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="yamada@example.co.jp"
            className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            電話番号
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="03-1234-5678"
            className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Member Count */}
        <div>
          <label
            htmlFor="memberCount"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            導入予定人数
          </label>
          <select
            id="memberCount"
            name="memberCount"
            value={form.memberCount}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="">選択してください</option>
            {MEMBER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            ご要望・ご質問
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            placeholder="導入時期、ご要望など自由にご記入ください"
            className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
      >
        {isSubmitting ? "送信中..." : "お問い合わせを送信"}
      </button>

      <p className="mt-3 text-center text-xs text-muted">
        お急ぎの場合は{" "}
        <a
          href="mailto:support@seiyaku-coach.com"
          className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:decoration-accent"
        >
          support@seiyaku-coach.com
        </a>{" "}
        まで直接ご連絡ください。
      </p>
    </form>
  );
}
