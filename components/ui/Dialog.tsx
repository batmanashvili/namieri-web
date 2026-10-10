"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { SectionTone } from "./Section";
import { IconButton } from "./IconButton";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Visually hide the title (it still labels the dialog). */
  hideTitle?: boolean;
  closeLabel: string;
  variant?: "modal" | "drawer" | "fullscreen";
  tone?: SectionTone;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const frames = {
  modal:
    "m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-card border border-hairline",
  drawer: "ms-auto me-0 my-0 h-dvh max-h-dvh w-[min(26rem,100vw)] border-s border-hairline",
  fullscreen: "m-0 h-dvh max-h-dvh w-screen max-w-none",
};

/**
 * Native <dialog> opened with showModal(): the rest of the page is inert,
 * focus moves inside and returns on close, Esc closes. Clicking the backdrop
 * closes modal and drawer variants. Enter/exit transitions live in globals.css.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle = false,
  closeLabel,
  variant = "modal",
  tone = "white",
  footer,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-dialog={variant === "drawer" ? "drawer" : "modal"}
      data-surface={tone}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (variant !== "fullscreen" && event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "overflow-hidden bg-surface p-0 text-fg backdrop:bg-transparent open:flex open:flex-col",
        frames[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-2 sm:px-8">
        <h2
          id={titleId}
          className={cn("pt-2 font-display text-h3 font-semibold", hideTitle && "sr-only")}
        >
          {title}
        </h2>
        <IconButton icon="close" label={closeLabel} onClick={onClose} className="ms-auto -me-2" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-8">{children}</div>
      {footer && <div className="border-t border-hairline px-6 py-4 sm:px-8">{footer}</div>}
    </dialog>
  );
}

type PresetProps = Omit<DialogProps, "variant">;

/** Centred dialog for confirmations and short notices. */
export function Modal(props: PresetProps) {
  return <Dialog {...props} variant="modal" />;
}

/** Side panel from the right, e.g. the cart drawer in Phase 3. */
export function Drawer({ tone = "cream", ...props }: PresetProps) {
  return <Dialog {...props} tone={tone} variant="drawer" />;
}
