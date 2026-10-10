import { describe, expect, it } from "vitest";
import {
  emptyLead,
  leadValuesFromFormData,
  toLead,
  validateLead,
  validateLeadField,
  type LeadValues,
} from "@/lib/leads/schema";
import { leadAdapter } from "@/lib/leads/submit";

const valid: LeadValues = {
  ...emptyLead,
  businessName: "Saburtalo Market",
  contactName: "Nino",
  phone: "574 07 77 79",
  businessType: "shop",
  district: "saburtalo",
  consent: true,
};

describe("wholesale lead validation", () => {
  it("accepts a minimal valid lead", () => {
    expect(validateLead(valid)).toEqual({});
  });

  it("requires name, contact, phone, type, district and consent", () => {
    expect(Object.keys(validateLead(emptyLead)).sort()).toEqual(
      ["businessName", "businessType", "consent", "contactName", "district", "phone"].sort(),
    );
  });

  it("checks phone and email formats; email is optional", () => {
    expect(validateLeadField("phone", { ...valid, phone: "123" })).toBe("invalid");
    expect(validateLeadField("email", { ...valid, email: "" })).toBeUndefined();
    expect(validateLeadField("email", { ...valid, email: "nino@" })).toBe("invalid");
    expect(validateLeadField("email", { ...valid, email: "nino@example.ge" })).toBeUndefined();
  });

  it("rejects values outside the option lists and over-long text", () => {
    expect(validateLeadField("businessType", { ...valid, businessType: "bank" })).toBe("invalid");
    expect(validateLeadField("district", { ...valid, district: "batumi" })).toBe("invalid");
    expect(validateLeadField("sizes", { ...valid, sizes: ["coming-soon"] })).toBe("invalid");
    expect(validateLeadField("message", { ...valid, message: "x".repeat(2001) })).toBe("tooLong");
  });

  it("reads FormData and normalises the lead", () => {
    const data = new FormData();
    for (const [k, v] of Object.entries({
      businessName: "  Café Vake ",
      contactName: "Giorgi",
      phone: "+995 599 12 34 56",
      businessType: "cafe",
      district: "vake",
      consent: "on",
    }))
      data.set(k, v);
    data.append("sizes", "cup-150");
    data.append("sizes", "cup-150");
    const values = leadValuesFromFormData(data);
    expect(validateLead(values)).toEqual({});
    expect(toLead(values)).toMatchObject({
      businessName: "Café Vake",
      phone: "599123456",
      sizes: ["cup-150"],
      consent: true,
    });
  });
});

describe("lead adapter selection", () => {
  it("posts to the webhook when LEAD_WEBHOOK_URL is set", () => {
    expect(leadAdapter({ LEAD_WEBHOOK_URL: "https://example.com/hook" } as never).name).toBe(
      "webhook",
    );
  });

  it("queues to the console in development and previews", () => {
    expect(leadAdapter({} as never).name).toBe("console");
    expect(leadAdapter({ VERCEL_ENV: "preview" } as never).name).toBe("console");
  });

  it("refuses in production without a destination, so no enquiry is silently lost", () => {
    expect(leadAdapter({ VERCEL_ENV: "production" } as never).name).toBe("unconfigured");
  });
});
