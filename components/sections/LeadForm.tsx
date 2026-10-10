"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { submitLeadAction, type LeadFormState } from "@/app/[locale]/contact/actions";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormField, Input, PhoneInput, Select, Textarea } from "@/components/ui/Form";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import {
  emptyLead,
  leadFields,
  MAX_LENGTH,
  validateLead,
  validateLeadField,
  type LeadErrorCode,
  type LeadErrors,
  type LeadField,
  type LeadValues,
} from "@/lib/leads/schema";

type Option = { value: string; label: string };

export type LeadFormCopy = {
  formLabel: string;
  requiredNote: string;
  optional: string;
  businessName: string;
  contactName: string;
  phone: string;
  phoneHint: string;
  email: string;
  emailHint: string;
  businessType: string;
  district: string;
  sizes: string;
  weeklyVolume: string;
  message: string;
  messageHint: string;
  consent: string;
  choose: string;
  submit: string;
  sending: string;
  errors: {
    required: string;
    choose: string;
    phone: string;
    email: string;
    consent: string;
    tooLong: Record<"name" | "email" | "message", string>;
  };
  /** "Please check {count} fields below", pre-formatted for 1…n. */
  errorSummary: string[];
  successTitle: string;
  successText: string;
  again: string;
  failureTitle: string;
  failureText: string;
  honeypot: string;
  contact: { phone: string; phoneHref: string; email: string };
};

type LeadFormProps = {
  locale: string;
  copy: LeadFormCopy;
  businessTypes: Option[];
  districts: Option[];
  sizes: Option[];
  volumes: Option[];
};

const fieldId = (field: LeadField) => `lead-${field}`;
const initialState: LeadFormState = { status: "idle" };

/**
 * Wholesale enquiry form. Fields validate on blur (then live once shown as
 * invalid) and again on submit, which focuses the first problem; the server
 * action validates once more. Never shows prices of any kind.
 */
export function LeadForm({
  locale,
  copy,
  businessTypes,
  districts,
  sizes,
  volumes,
}: LeadFormProps) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [values, setValues] = useState<LeadValues>(emptyLead);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [summary, setSummary] = useState(0);
  const [dismissed, setDismissed] = useState<LeadFormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const showSuccess = state.status === "success" && dismissed !== state;
  const showFailure = state.status === "error" && dismissed !== state;

  // Server-side validation errors (normally unreachable: the client checks first).
  // Adjusted during render when a new action result arrives, not in an effect.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.status === "invalid") {
      setErrors(state.errors);
      setSummary(Object.keys(state.errors).length);
    }
  }

  useEffect(() => {
    if (state.status === "success") {
      track("b2b_form_submit", { business_type: state.businessType });
      successRef.current?.focus();
    }
  }, [state]);

  const message = (field: LeadField, code: LeadErrorCode | undefined) => {
    if (!code) return undefined;
    if (code === "tooLong") {
      return field === "message"
        ? copy.errors.tooLong.message
        : field === "email"
          ? copy.errors.tooLong.email
          : copy.errors.tooLong.name;
    }
    switch (field) {
      case "phone":
        return code === "required" ? copy.errors.required : copy.errors.phone;
      case "email":
        return copy.errors.email;
      case "consent":
        return copy.errors.consent;
      case "businessType":
      case "district":
      case "weeklyVolume":
      case "sizes":
        return copy.errors.choose;
      default:
        return copy.errors.required;
    }
  };

  const update = <F extends LeadField>(field: F, value: LeadValues[F]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field shows an error, re-check it as the visitor fixes it.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validateLeadField(field, next) }));
  };

  const blur = (field: LeadField) => () =>
    setErrors((e) => ({ ...e, [field]: validateLeadField(field, values) }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateLead(values);
    const invalid = leadFields.filter((field) => found[field]);
    setErrors(found);
    setSummary(invalid.length);
    if (invalid.length > 0) {
      document.getElementById(fieldId(invalid[0]!))?.focus();
      return;
    }
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };

  const reset = () => {
    setDismissed(state);
    setValues(emptyLead);
    setErrors({});
    setSummary(0);
    requestAnimationFrame(() => document.getElementById(fieldId("businessName"))?.focus());
  };

  if (showSuccess) {
    return (
      <div
        role="status"
        className="grid justify-items-start gap-4 rounded-card border border-hairline bg-raised p-6 sm:p-10"
      >
        <span className="grid size-14 place-items-center rounded-full border border-ok text-ok">
          <Icon name="check" size={28} />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="font-display text-h2 font-semibold outline-none"
        >
          {copy.successTitle}
        </h3>
        <p className="text-body text-fg-muted">{copy.successText}</p>
        <Button variant="secondary" onClick={reset}>
          {copy.again}
        </Button>
      </div>
    );
  }

  const err = (field: LeadField) => message(field, errors[field]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-label={copy.formLabel}
      className="grid gap-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {copy.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <p className="text-small text-fg-muted">{copy.requiredNote}</p>

      <div aria-live="polite" aria-atomic="true">
        {summary > 0 && (
          <p className="flex items-center gap-2 rounded-control border border-danger px-4 py-3 text-small text-danger">
            <Icon name="alert" size={18} />
            {copy.errorSummary[Math.min(summary, copy.errorSummary.length) - 1]}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label={copy.businessName}
          required
          id={fieldId("businessName")}
          error={err("businessName")}
        >
          <Input
            name="businessName"
            autoComplete="organization"
            maxLength={MAX_LENGTH.name}
            value={values.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            onBlur={blur("businessName")}
          />
        </FormField>
        <FormField
          label={copy.contactName}
          required
          id={fieldId("contactName")}
          error={err("contactName")}
        >
          <Input
            name="contactName"
            autoComplete="name"
            maxLength={MAX_LENGTH.name}
            value={values.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            onBlur={blur("contactName")}
          />
        </FormField>
        <FormField
          label={copy.phone}
          hint={copy.phoneHint}
          required
          id={fieldId("phone")}
          error={err("phone")}
        >
          <PhoneInput
            name="phone"
            value={values.phone}
            onValueChange={(digits) => update("phone", digits)}
            onBlur={blur("phone")}
          />
        </FormField>
        <FormField
          label={copy.email}
          hint={copy.emailHint}
          optionalLabel={copy.optional}
          id={fieldId("email")}
          error={err("email")}
        >
          <Input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            maxLength={MAX_LENGTH.email}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={blur("email")}
          />
        </FormField>
        <FormField
          label={copy.businessType}
          required
          id={fieldId("businessType")}
          error={err("businessType")}
        >
          <Select
            name="businessType"
            placeholder={copy.choose}
            options={businessTypes}
            value={values.businessType}
            onChange={(e) => update("businessType", e.target.value)}
            onBlur={blur("businessType")}
          />
        </FormField>
        <FormField label={copy.district} required id={fieldId("district")} error={err("district")}>
          <Select
            name="district"
            placeholder={copy.choose}
            options={districts}
            value={values.district}
            onChange={(e) => update("district", e.target.value)}
            onBlur={blur("district")}
          />
        </FormField>
      </div>

      <fieldset
        className="grid gap-1"
        aria-describedby={errors.sizes ? "lead-sizes-error" : undefined}
      >
        <legend className="mb-1 text-small font-medium text-fg">
          {copy.sizes} <span className="font-normal text-fg-muted">({copy.optional})</span>
        </legend>
        <div id={fieldId("sizes")} tabIndex={-1} className="flex flex-wrap gap-x-8 outline-none">
          {sizes.map((size) => (
            <Checkbox
              key={size.value}
              name="sizes"
              value={size.value}
              label={size.label}
              checked={values.sizes.includes(size.value)}
              onChange={(e) =>
                update(
                  "sizes",
                  e.target.checked
                    ? [...values.sizes, size.value]
                    : values.sizes.filter((id) => id !== size.value),
                )
              }
            />
          ))}
        </div>
        {errors.sizes && (
          <p id="lead-sizes-error" className="text-small text-danger">
            {err("sizes")}
          </p>
        )}
      </fieldset>

      <FormField
        label={copy.weeklyVolume}
        optionalLabel={copy.optional}
        id={fieldId("weeklyVolume")}
        error={err("weeklyVolume")}
        className="sm:max-w-[calc(50%-0.75rem)]"
      >
        <Select
          name="weeklyVolume"
          placeholder={copy.choose}
          options={volumes}
          value={values.weeklyVolume}
          onChange={(e) => update("weeklyVolume", e.target.value)}
          onBlur={blur("weeklyVolume")}
        />
      </FormField>

      <FormField
        label={copy.message}
        hint={copy.messageHint}
        optionalLabel={copy.optional}
        id={fieldId("message")}
        error={err("message")}
      >
        <Textarea
          name="message"
          maxLength={MAX_LENGTH.message}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={blur("message")}
        />
      </FormField>

      <Checkbox
        id={fieldId("consent")}
        name="consent"
        label={copy.consent}
        required
        checked={values.consent}
        onChange={(e) => update("consent", e.target.checked)}
        error={err("consent")}
      />

      {showFailure && (
        <div
          role="alert"
          className="grid gap-2 rounded-control border border-danger px-4 py-4 text-small"
        >
          <p className="flex items-center gap-2 font-medium text-danger">
            <Icon name="alert" size={18} />
            {copy.failureTitle}
          </p>
          <p className="text-fg">
            {copy.failureText}{" "}
            <a
              href={copy.contact.phoneHref}
              className="font-medium tabular underline underline-offset-4"
            >
              {copy.contact.phone}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${copy.contact.email}`}
              className="font-medium underline underline-offset-4"
            >
              {copy.contact.email}
            </a>
          </p>
        </div>
      )}

      <div>
        <Button
          type="submit"
          size="lg"
          loading={pending}
          loadingLabel={copy.sending}
          iconEnd="arrowRight"
        >
          {copy.submit}
        </Button>
      </div>
    </form>
  );
}
