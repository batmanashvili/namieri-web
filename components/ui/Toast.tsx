"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export type ToastTone = "success" | "error" | "info";
type ToastItem = { id: number; tone: ToastTone; message: ReactNode };

const ToastCtx = createContext<{ show: (tone: ToastTone, message: ReactNode) => void } | null>(
  null,
);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const icons: Record<ToastTone, IconName> = { success: "checkCircle", error: "alert", info: "info" };
const accents: Record<ToastTone, string> = {
  success: "text-success-300",
  error: "text-error-300",
  info: "text-glacier-300",
};

type ToastViewProps = {
  tone: ToastTone;
  children: ReactNode;
  dismissLabel: string;
  onDismiss?: () => void;
  className?: string;
};

/** The toast card itself; also used on its own in the styleguide. */
export function ToastView({ tone, children, dismissLabel, onDismiss, className }: ToastViewProps) {
  return (
    <div
      data-surface="navy"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-hairline bg-surface py-3 ps-4 pe-2 text-fg",
        className,
      )}
    >
      <Icon name={icons[tone]} size={20} className={cn("mt-0.5", accents[tone])} />
      <p className="flex-1 py-0.5 text-small">{children}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-my-1 grid size-9 shrink-0 place-items-center rounded-control text-fg-muted transition-colors hover:bg-fg/8 hover:text-fg"
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}

const AUTO_DISMISS_MS = 6000;

function ToastEntry({
  item,
  dismissLabel,
  onDismiss,
}: {
  item: ToastItem;
  dismissLabel: string;
  onDismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(AUTO_DISMISS_MS);

  useEffect(() => {
    // Errors stay until dismissed; others pause while hovered or focused.
    if (item.tone === "error" || paused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => onDismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [item, paused, onDismiss]);

  return (
    <li
      role={item.tone === "error" ? "alert" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex justify-center sm:justify-end"
    >
      <ToastView tone={item.tone} dismissLabel={dismissLabel} onDismiss={() => onDismiss(item.id)}>
        {item.message}
      </ToastView>
    </li>
  );
}

type ToastProviderProps = { children: ReactNode; regionLabel: string; dismissLabel: string };

export function ToastProvider({ children, regionLabel, dismissLabel }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback(
    (id: number) => setItems((current) => current.filter((t) => t.id !== id)),
    [],
  );
  const show = useCallback((tone: ToastTone, message: ReactNode) => {
    nextId.current += 1;
    const id = nextId.current;
    setItems((current) => [...current.slice(-2), { id, tone, message }]);
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastCtx value={api}>
      {children}
      <section
        aria-label={regionLabel}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
      >
        <ol aria-live="polite" aria-relevant="additions" className="grid gap-2">
          {items.map((item) => (
            <ToastEntry key={item.id} item={item} dismissLabel={dismissLabel} onDismiss={dismiss} />
          ))}
        </ol>
      </section>
    </ToastCtx>
  );
}
