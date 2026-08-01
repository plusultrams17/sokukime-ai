/**
 * Anthropic 互換シム（中身は OpenAI）
 *
 * 目的: 採点・分析系の LLM 呼び出しを OpenAI に一本化し、
 * 課金する API 口座を OpenAI だけにする（Anthropic 課金を不要にする）。
 *
 * 使い方は Anthropic SDK と同一:
 *   const client = new Anthropic({ apiKey });
 *   const res = await client.messages.create({ model, max_tokens, temperature, system, messages });
 *   const text = res.content[0].text;
 *
 * - model 引数は無視し、下の SHIM_MODEL で実行する。
 * - 採点品質を上げたい場合は SHIM_MODEL を "gpt-4o" に変更する（コストは上がる）。
 * - 応答は Anthropic と同じ { content: [{ type: "text", text }] } 形で返すので、既存コードは無改修で動く。
 */
import OpenAI from "openai";

// 既定モデル（低コスト・高品質）。品質重視にするなら "gpt-4o" に変更。
const SHIM_MODEL = "gpt-4o-mini";

type Role = "user" | "assistant" | "system";
interface AnthropicMessage {
  role: Role;
  content: string;
}
interface CreateParams {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system?: string;
  messages: AnthropicMessage[];
}
interface AnthropicLikeResponse {
  content: { type: "text"; text: string }[];
}

export default class Anthropic {
  private client: OpenAI;

  constructor(opts: { apiKey?: string } = {}) {
    this.client = new OpenAI({
      apiKey: opts.apiKey || process.env.OPENAI_API_KEY,
    });
  }

  messages = {
    create: async (params: CreateParams): Promise<AnthropicLikeResponse> => {
      const msgs: { role: Role; content: string }[] = [];
      if (params.system) {
        msgs.push({ role: "system", content: params.system });
      }
      for (const m of params.messages) {
        msgs.push({
          role: m.role,
          content:
            typeof m.content === "string" ? m.content : String(m.content),
        });
      }

      const completion = await this.client.chat.completions.create({
        model: SHIM_MODEL,
        messages: msgs,
        max_tokens: params.max_tokens ?? 2000,
        temperature: params.temperature ?? 0.7,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      return { content: [{ type: "text", text }] };
    },
  };
}
