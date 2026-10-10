"use server";

import { hasLocale } from "next-intl";
import { leadValuesFromFormData, toLead, validateLead, type LeadErrors } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { routing } from "@/lib/i18n/routing";

export type LeadFormState =
  | { status: "idle" }
  | { status: "success"; businessType: string }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "error" };

/** Wholesale form action. Validates again on the server, then hands off to submitLead(). */
export async function submitLeadAction(
  _previous: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (formData.get("website")) return { status: "success", businessType: "other" };

  const locale = formData.get("locale");
  const values = leadValuesFromFormData(formData);
  const errors = validateLead(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const lead = toLead(values);
  const result = await submitLead(
    lead,
    typeof locale === "string" && hasLocale(routing.locales, locale)
      ? locale
      : routing.defaultLocale,
  );
  return result.ok ? { status: "success", businessType: lead.businessType } : { status: "error" };
}
