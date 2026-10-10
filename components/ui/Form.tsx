"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { formatGeorgianMobile, GE_PREFIX, normalizeGeorgianMobile } from "@/lib/phone";
import { Icon } from "./Icon";

/* ---- FormField ----------------------------------------------------------- */

type FieldContext = { id: string; describedBy?: string; invalid: boolean; required: boolean };
const FieldCtx = createContext<FieldContext | null>(null);

/** Wires the nearest FormField's id, hint/error ids and invalid state into a control. */
function useField(props: {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: unknown;
  required?: boolean;
}) {
  const field = useContext(FieldCtx);
  const describedBy =
    [field?.describedBy, props["aria-describedby"]].filter(Boolean).join(" ") || undefined;
  return {
    id: props.id ?? field?.id,
    "aria-describedby": describedBy,
    "aria-invalid": (props["aria-invalid"] as boolean | undefined) ?? (field?.invalid || undefined),
    required: props.required ?? field?.required,
  };
}

type FormFieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  /** Error text. Shown with an icon and announced via aria-describedby. */
  error?: ReactNode;
  required?: boolean;
  /** e.g. "optional", shown after the label when not required. */
  optionalLabel?: string;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  hint,
  error,
  required = false,
  optionalLabel,
  id,
  className,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={fieldId} className="text-small font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent">
            {" "}
            *
          </span>
        )}
        {!required && optionalLabel && (
          <span className="font-normal text-fg-muted"> ({optionalLabel})</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-small text-fg-muted">
          {hint}
        </p>
      )}
      <FieldCtx
        value={{
          id: fieldId,
          describedBy: [hintId, errorId].filter(Boolean).join(" ") || undefined,
          invalid: Boolean(error),
          required,
        }}
      >
        {children}
      </FieldCtx>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-small text-danger">
      <Icon name="alert" size={18} className="mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

/* ---- Shared field styles --------------------------------------------------- */

export const fieldClasses =
  "block w-full min-h-12 rounded-control border border-field-border bg-field px-4 py-3 font-body text-body leading-snug text-ink-900 " +
  "placeholder:text-stone-600 transition-[border-color,background-color] duration-200 " +
  "hover:border-field-border-hover " +
  "disabled:cursor-not-allowed disabled:border-stone-600/40 disabled:bg-cream-50 disabled:text-stone-600 " +
  "aria-invalid:border-danger aria-invalid:hover:border-danger";

/* ---- Input / Textarea / Select ------------------------------------------- */

export function Input({ className, ...props }: ComponentProps<"input">) {
  const field = useField(props);
  return <input data-field="" {...props} {...field} className={cn(fieldClasses, className)} />;
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  const field = useField(props);
  return (
    <textarea
      data-field=""
      rows={rows}
      {...props}
      {...field}
      className={cn(fieldClasses, "min-h-32 resize-y", className)}
    />
  );
}

type SelectProps = ComponentProps<"select"> & {
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({ options, placeholder, className, defaultValue, ...props }: SelectProps) {
  const field = useField(props);
  return (
    <div className="relative">
      <select
        data-field=""
        defaultValue={defaultValue ?? (placeholder && props.value === undefined ? "" : undefined)}
        {...props}
        {...field}
        className={cn(fieldClasses, "cursor-pointer appearance-none pr-12", className)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        size={20}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-900"
      />
    </div>
  );
}

/* ---- Checkbox ------------------------------------------------------------- */

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

const checkMark =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E\")";

export function Checkbox({ label, hint, error, id, className, disabled, ...props }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "group/check flex min-h-11 cursor-pointer items-start gap-3 py-2",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
          <input
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              "peer size-6 cursor-[inherit] appearance-none rounded-[4px] border border-field-border bg-field transition-colors duration-200",
              "group-hover/check:border-field-border-hover checked:border-control-checked checked:bg-control-checked",
              "aria-invalid:border-danger",
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto size-4 scale-50 bg-on-control-checked opacity-0 transition-[opacity,scale] duration-200 peer-checked:scale-100 peer-checked:opacity-100"
            style={{ maskImage: checkMark, WebkitMaskImage: checkMark, maskSize: "contain" }}
          />
        </span>
        <span className="text-small text-fg">{label}</span>
      </label>
      {hint && (
        <p id={hintId} className="ps-9 text-small text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <div className="ps-9">
          <FieldError id={errorId}>{error}</FieldError>
        </div>
      )}
    </div>
  );
}

/* ---- RadioCardGroup -------------------------------------------------------- */

export type RadioCardOption = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
};

type RadioCardGroupProps = {
  name: string;
  legend: ReactNode;
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: ReactNode;
  required?: boolean;
  columns?: 1 | 2 | 3;
  className?: string;
};

export function RadioCardGroup({
  name,
  legend,
  options,
  value,
  defaultValue,
  onValueChange,
  error,
  required,
  columns = 3,
  className,
}: RadioCardGroupProps) {
  const errorId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternal(event.target.value);
    onValueChange?.(event.target.value);
  };

  return (
    <fieldset className={cn("grid gap-3", className)}>
      <legend className="mb-3 text-small font-medium text-fg">{legend}</legend>
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const checked = selected === option.value;
          return (
            <label
              key={option.value}
              data-checked={checked || undefined}
              className={cn(
                "relative flex min-h-11 cursor-pointer gap-4 rounded-card border border-hairline bg-raised p-4 transition-colors duration-200",
                "hover:border-field-border-hover has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus",
                "data-checked:border-control-checked data-checked:shadow-[inset_0_0_0_1px_var(--control-checked)]",
                option.disabled && "cursor-not-allowed opacity-55 hover:border-hairline",
                error && !checked && "border-danger",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value !== undefined ? checked : undefined}
                defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                disabled={option.disabled}
                required={required}
                onChange={onChange}
                aria-describedby={error ? errorId : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-fg-muted peer-checked:border-control-checked"
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full bg-control-checked transition-transform",
                    checked ? "scale-100" : "scale-0",
                  )}
                />
              </span>
              <span className="grid min-w-0 flex-1 gap-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-fg">{option.title}</span>
                  {option.badge}
                </span>
                {option.description && (
                  <span className="text-small text-fg-muted">{option.description}</span>
                )}
                {option.meta && (
                  <span className="text-small font-medium text-fg tabular">{option.meta}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}

/* ---- PhoneInput ------------------------------------------------------------ */

type PhoneInputProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  /** National digits, e.g. "574077779". */
  value?: string;
  defaultValue?: string;
  /** Called with the national digits (max 9). */
  onValueChange?: (digits: string) => void;
};

/** +995 prefix and a 9-digit Georgian mobile number, grouped as 5XX XX XX XX. */
export function PhoneInput({
  value,
  defaultValue = "",
  onValueChange,
  className,
  ...rest
}: PhoneInputProps) {
  // Styleguide state previews apply to the visible frame, not the inner input.
  const { "data-preview": preview, ...props } = rest as typeof rest & { "data-preview"?: string };
  const field = useField(props);
  const prefixId = useId();
  const [internal, setInternal] = useState(normalizeGeorgianMobile(defaultValue));
  const digits = value !== undefined ? normalizeGeorgianMobile(value) : internal;

  return (
    <div
      data-field=""
      data-preview={preview}
      className={cn(
        fieldClasses,
        "flex items-stretch gap-0 p-0 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-focus",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-cream-50 has-[input[aria-invalid=true]]:border-danger",
        className,
      )}
    >
      <span
        id={prefixId}
        className="flex items-center border-r border-stone-600/30 px-3 text-body text-stone-600 tabular select-none"
      >
        {GE_PREFIX}
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="5XX XX XX XX"
        maxLength={12}
        {...props}
        {...field}
        aria-describedby={[prefixId, field["aria-describedby"]].filter(Boolean).join(" ")}
        value={formatGeorgianMobile(digits)}
        onChange={(event) => {
          const next = normalizeGeorgianMobile(event.target.value);
          setInternal(next);
          onValueChange?.(next);
        }}
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink-900 tabular outline-none placeholder:text-stone-600 disabled:cursor-not-allowed"
      />
    </div>
  );
}

/* ---- QuantityStepper ------------------------------------------------------- */

type QuantityStepperProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  /** Accessible names. */
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
  className?: string;
};

export function QuantityStepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 99,
  onValueChange,
  label,
  decreaseLabel,
  increaseLabel,
  disabled,
  className,
}: QuantityStepperProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, Number.isFinite(next) ? Math.round(next) : min));
    setInternal(clamped);
    onValueChange?.(clamped);
  };
  const stepButton =
    "grid size-11 place-items-center text-ink-900 transition-colors hover:bg-ink-900/6 active:bg-ink-900/12 " +
    "disabled:cursor-not-allowed disabled:text-stone-600/50 disabled:hover:bg-transparent";

  return (
    <div
      data-field=""
      className={cn(
        "inline-flex items-center rounded-control border border-field-border bg-field",
        disabled && "opacity-60",
        className,
      )}
    >
      <button
        type="button"
        className={cn(stepButton, "rounded-l-control")}
        onClick={() => set(current - 1)}
        disabled={disabled || current <= min}
        aria-label={decreaseLabel}
      >
        <Icon name="minus" size={18} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={current}
        disabled={disabled}
        onChange={(event) => set(Number(event.target.value.replace(/\D/g, "")))}
        className="h-11 w-12 border-x border-stone-600/30 bg-transparent text-center text-body font-medium text-ink-900 tabular outline-offset-0"
      />
      <button
        type="button"
        className={cn(stepButton, "rounded-r-control")}
        onClick={() => set(current + 1)}
        disabled={disabled || current >= max}
        aria-label={increaseLabel}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
