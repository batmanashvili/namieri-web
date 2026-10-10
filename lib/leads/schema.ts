/**
 * Wholesale (B2B) lead: fields, options and validation. Shared by the form
 * (validate on blur) and the server action (validate again before sending),
 * so the rules can't drift apart. No prices of any kind belong here.
 */
import { districtIds, type District } from "@/content/districts";
import { availableSizes } from "@/content/product";
import { isValidGeorgianMobile, normalizeGeorgianMobile } from "@/lib/phone";

export const businessTypes = ["shop", "cafe", "restaurant", "gym", "other"] as const;
export type BusinessType = (typeof businessTypes)[number];

/** Estimated packs per week. */
export const weeklyVolumes = ["under50", "50to200", "200to500", "over500"] as const;
export type WeeklyVolume = (typeof weeklyVolumes)[number];

export const leadSizeIds = availableSizes.map((size) => size.id);

export type LeadValues = {
  businessName: string;
  contactName: string;
  /** National digits, e.g. "574077779". */
  phone: string;
  email: string;
  businessType: string;
  district: string;
  sizes: string[];
  weeklyVolume: string;
  message: string;
  consent: boolean;
};

export type LeadField = keyof LeadValues;
export type LeadErrorCode = "required" | "invalid" | "tooLong";
export type LeadErrors = Partial<Record<LeadField, LeadErrorCode>>;

/** A validated lead, ready for an adapter. */
export type Lead = Omit<LeadValues, "businessType" | "district" | "weeklyVolume"> & {
  businessType: BusinessType;
  district: District;
  weeklyVolume: WeeklyVolume | "";
};

export const emptyLead: LeadValues = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  businessType: "",
  district: "",
  sizes: [],
  weeklyVolume: "",
  message: "",
  consent: false,
};

/** Order matters: the form focuses the first invalid field in this order. */
export const leadFields: readonly LeadField[] = [
  "businessName",
  "contactName",
  "phone",
  "email",
  "businessType",
  "district",
  "sizes",
  "weeklyVolume",
  "message",
  "consent",
];

export const MAX_LENGTH = { name: 120, email: 254, message: 2000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const oneOf = (list: readonly string[], value: string) => list.includes(value);

export function validateLeadField(field: LeadField, v: LeadValues): LeadErrorCode | undefined {
  switch (field) {
    case "businessName":
    case "contactName": {
      const value = v[field].trim();
      if (!value) return "required";
      return value.length > MAX_LENGTH.name ? "tooLong" : undefined;
    }
    case "phone":
      if (!v.phone.trim()) return "required";
      return isValidGeorgianMobile(v.phone) ? undefined : "invalid";
    case "email": {
      const value = v.email.trim();
      if (!value) return undefined; // optional
      if (value.length > MAX_LENGTH.email) return "tooLong";
      return EMAIL.test(value) ? undefined : "invalid";
    }
    case "businessType":
      if (!v.businessType) return "required";
      return oneOf(businessTypes, v.businessType) ? undefined : "invalid";
    case "district":
      if (!v.district) return "required";
      return oneOf(districtIds, v.district) ? undefined : "invalid";
    case "sizes":
      return v.sizes.every((id) => oneOf(leadSizeIds, id)) ? undefined : "invalid";
    case "weeklyVolume":
      if (!v.weeklyVolume) return undefined; // optional
      return oneOf(weeklyVolumes, v.weeklyVolume) ? undefined : "invalid";
    case "message":
      return v.message.length > MAX_LENGTH.message ? "tooLong" : undefined;
    case "consent":
      return v.consent ? undefined : "required";
  }
}

export function validateLead(values: LeadValues): LeadErrors {
  const errors: LeadErrors = {};
  for (const field of leadFields) {
    const error = validateLeadField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}

/** Normalises and narrows valid values into a Lead. Call only when validateLead() is empty. */
export function toLead(values: LeadValues): Lead {
  return {
    businessName: values.businessName.trim(),
    contactName: values.contactName.trim(),
    phone: normalizeGeorgianMobile(values.phone),
    email: values.email.trim(),
    businessType: values.businessType as BusinessType,
    district: values.district as District,
    sizes: [...new Set(values.sizes)],
    weeklyVolume: values.weeklyVolume as WeeklyVolume | "",
    message: values.message.trim(),
    consent: values.consent,
  };
}

/** Reads the form's FormData (field names match LeadValues). Never trusts its shape. */
export function leadValuesFromFormData(data: FormData): LeadValues {
  const text = (name: string) => {
    const value = data.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    businessName: text("businessName"),
    contactName: text("contactName"),
    phone: text("phone"),
    email: text("email"),
    businessType: text("businessType"),
    district: text("district"),
    sizes: data.getAll("sizes").filter((v): v is string => typeof v === "string"),
    weeklyVolume: text("weeklyVolume"),
    message: text("message"),
    consent: data.get("consent") === "on",
  };
}
