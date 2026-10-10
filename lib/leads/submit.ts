import "server-only";
import type { Locale } from "@/lib/i18n/routing";
import type { Lead } from "./schema";

/*
 * submitLead(): the one place a wholesale lead leaves the site.
 *
 * No contact/lead endpoint is documented for the existing backend yet (see
 * BLOCKERS.md), so the destination is pluggable:
 *   - LEAD_WEBHOOK_URL set → POST the lead as JSON (Zapier, Make, n8n, a CRM,
 *     or the backend's endpoint once it exists). LEAD_WEBHOOK_SECRET, if set,
 *     is sent as a bearer token.
 *   - otherwise, in development and previews → logged to the server console
 *     ("queued"), so the form can be tested end to end.
 *   - otherwise, in production → refused, so a real enquiry is never silently
 *     dropped; the form then shows the phone and email instead.
 * To connect the backend, add an adapter below and return it from leadAdapter().
 */

export type LeadSubmission = Lead & {
  locale: Locale;
  submittedAt: string;
  source: "website-contact-form";
};

export type SubmitLeadResult =
  { ok: true; delivery: "sent" | "queued" } | { ok: false; reason: "unconfigured" | "failed" };

export type LeadAdapter = {
  name: string;
  submit: (lead: LeadSubmission) => Promise<SubmitLeadResult>;
};

const TIMEOUT_MS = 8000;

export function webhookAdapter(url: string, secret?: string): LeadAdapter {
  return {
    name: "webhook",
    async submit(lead) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(secret ? { authorization: `Bearer ${secret}` } : {}),
          },
          body: JSON.stringify(lead),
          signal: AbortSignal.timeout(TIMEOUT_MS),
          cache: "no-store",
        });
        if (!response.ok) {
          console.error(`[lead] webhook responded ${response.status}`);
          return { ok: false, reason: "failed" };
        }
        return { ok: true, delivery: "sent" };
      } catch (error) {
        console.error("[lead] webhook request failed", error);
        return { ok: false, reason: "failed" };
      }
    },
  };
}

export const consoleAdapter: LeadAdapter = {
  name: "console",
  async submit(lead) {
    console.info("[lead] queued (no LEAD_WEBHOOK_URL configured)", JSON.stringify(lead));
    return { ok: true, delivery: "queued" };
  },
};

export const unconfiguredAdapter: LeadAdapter = {
  name: "unconfigured",
  async submit() {
    console.error("[lead] LEAD_WEBHOOK_URL is not set; a wholesale enquiry could not be delivered");
    return { ok: false, reason: "unconfigured" };
  },
};

export function leadAdapter(env: NodeJS.ProcessEnv = process.env): LeadAdapter {
  if (env.LEAD_WEBHOOK_URL) return webhookAdapter(env.LEAD_WEBHOOK_URL, env.LEAD_WEBHOOK_SECRET);
  if (env.VERCEL_ENV === "production") return unconfiguredAdapter;
  return consoleAdapter;
}

export async function submitLead(lead: Lead, locale: Locale): Promise<SubmitLeadResult> {
  return leadAdapter().submit({
    ...lead,
    locale,
    submittedAt: new Date().toISOString(),
    source: "website-contact-form",
  });
}
