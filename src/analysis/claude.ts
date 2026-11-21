import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaContentBlockParam, BetaTextBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type { z } from "zod";
import { env } from "../config";
import { log } from "../util/log";

export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

let client: Anthropic | null = null;

/**
 * Uma chamada ao Claude com resposta em JSON validado pelo `schema`.
 * - `instructions`: o papel e as regras desta etapa
 * - `knowledge`: a base de conhecimento (grande e igual entre chamadas → vai em cache)
 * Devolve null se o modelo recusar o pedido.
 */
export async function askClaude<S extends z.ZodType>(opts: {
  schema: S;
  instructions: string;
  knowledge?: string;
  content: BetaContentBlockParam[];
  effort: Effort;
  label: string;
}): Promise<z.infer<S> | null> {
  client ??= new Anthropic();
  const system: BetaTextBlockParam[] = [{ type: "text", text: opts.instructions }];
  if (opts.knowledge) system.push({ type: "text", text: opts.knowledge, cache_control: { type: "ephemeral" } });

  const response = await client.beta.messages.parse({
    model: env("CLAUDE_MODEL") ?? "claude-opus-5-5",
    max_tokens: 16000,
    // Se o modelo recusar por política, a API tenta de novo num modelo substituto padrão.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: opts.effort, format: betaZodOutputFormat(opts.schema) },
    system,
    messages: [{ role: "user", content: opts.content }],
  });

  if (response.stop_reason === "refusal") {
    log.warn(`Claude recusou (${opts.label}): ${response.stop_details?.category ?? "sem categoria"}.`);
    return null;
  }
  if (response.stop_reason === "max_tokens") throw new Error(`Resposta do Claude cortada por max_tokens (${opts.label}).`);
  const parsed = response.parsed_output as z.infer<S> | null;
  if (!parsed) throw new Error(`Claude não devolveu um JSON válido (${opts.label}).`);
  const u = response.usage;
  log.info(
    `Claude (${opts.label}): ${u.input_tokens} in + ${u.cache_read_input_tokens ?? 0} cache + ${u.output_tokens} out tokens`,
  );
  return parsed;
}

export function effort(name: "CLAUDE_EFFORT" | "CLAUDE_EDIT_EFFORT", fallback: Effort): Effort {
  const v = env(name);
  return v && ["low", "medium", "high", "xhigh", "max"].includes(v) ? (v as Effort) : fallback;
}
