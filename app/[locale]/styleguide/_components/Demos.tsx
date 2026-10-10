"use client";

/*
 * Interactive styleguide demos. Copy comes in as props from the server
 * components, so the Styleguide namespace never ships to the browser.
 */

import { useState } from "react";
import { m, useTransform } from "motion/react";
import { usePinnedProgress } from "@/components/motion/PinnedScene";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Cards";
import { Drawer, Modal } from "@/components/ui/Dialog";
import { FormField, PhoneInput } from "@/components/ui/Form";
import { Icon } from "@/components/ui/Icon";
import { Plinth } from "@/components/ui/Plinth";
import { useToast } from "@/components/ui/Toast";
import { isValidGeorgianMobile } from "@/lib/phone";

/* ---- Phone validation -------------------------------------------------------- */

export function PhoneDemo({
  label,
  hint,
  error,
  defaultValue = "",
  validateInitially = false,
}: {
  label: string;
  hint: string;
  error: string;
  defaultValue?: string;
  validateInitially?: boolean;
}) {
  const [digits, setDigits] = useState(defaultValue);
  const [touched, setTouched] = useState(validateInitially);
  const invalid = touched && !isValidGeorgianMobile(digits);
  return (
    <FormField label={label} hint={hint} error={invalid ? error : undefined} required>
      <PhoneInput value={digits} onValueChange={setDigits} onBlur={() => setTouched(true)} />
    </FormField>
  );
}

/* ---- Toasts -------------------------------------------------------------------- */

export function ToastDemo({
  labels,
  messages,
}: {
  labels: { success: string; error: string; info: string };
  messages: { success: string; error: string; info: string };
}) {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        iconStart="checkCircle"
        onClick={() => toast.show("success", messages.success)}
      >
        {labels.success}
      </Button>
      <Button
        size="sm"
        variant="secondary"
        iconStart="alert"
        onClick={() => toast.show("error", messages.error)}
      >
        {labels.error}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        iconStart="info"
        onClick={() => toast.show("info", messages.info)}
      >
        {labels.info}
      </Button>
    </div>
  );
}

/* ---- Drawer and modal -------------------------------------------------------------- */

type DialogCopy = {
  openDrawer: string;
  openModal: string;
  close: string;
  drawerTitle: string;
  drawerText: string;
  emptyTitle: string;
  emptyText: string;
  emptyAction: string;
  modalTitle: string;
  modalText: string;
  modalConfirm: string;
};

export function DialogDemo({ copy }: { copy: DialogCopy }) {
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="sm" iconStart="cart" onClick={() => setDrawer(true)} aria-haspopup="dialog">
        {copy.openDrawer}
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setModal(true)} aria-haspopup="dialog">
        {copy.openModal}
      </Button>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={copy.drawerTitle}
        closeLabel={copy.close}
      >
        <p className="text-small text-fg-muted">{copy.drawerText}</p>
        <EmptyState
          className="mt-12"
          title={copy.emptyTitle}
          illustration={<Plinth className="w-40 opacity-80" />}
          action={
            <Button size="sm" onClick={() => setDrawer(false)}>
              {copy.emptyAction}
            </Button>
          }
        >
          <p>{copy.emptyText}</p>
        </EmptyState>
      </Drawer>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={copy.modalTitle}
        closeLabel={copy.close}
        footer={
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setModal(false)}>
              {copy.modalConfirm}
            </Button>
          </div>
        }
      >
        <p className="text-body text-fg-muted">{copy.modalText}</p>
      </Modal>
    </div>
  );
}

/* ---- Pinned "two ingredients" scene ----------------------------------------------- */

export function TwoIngredientsScene({
  milk,
  cultures,
  result,
}: {
  milk: string;
  cultures: string;
  result: string;
}) {
  const progress = usePinnedProgress();
  const milkX = useTransform(progress, [0, 0.7], ["-34vw", "0vw"]);
  const culturesX = useTransform(progress, [0, 0.7], ["34vw", "0vw"]);
  const merge = useTransform(progress, [0.55, 0.75], [1, 0]);
  const reveal = useTransform(progress, [0.7, 0.9], [0, 1]);
  const lift = useTransform(progress, [0.7, 0.9], [24, 0]);

  return (
    <div className="relative grid h-full place-items-center">
      <div className="relative grid size-72 place-items-center">
        <m.div
          style={{ x: milkX, opacity: merge }}
          className="absolute grid justify-items-center gap-3 text-fg"
        >
          <span className="grid size-20 place-items-center rounded-full border border-hairline">
            <Icon name="drop" size={36} />
          </span>
          <span className="bg-surface text-small">{milk}</span>
        </m.div>
        <m.div
          style={{ x: culturesX, opacity: merge }}
          className="absolute grid justify-items-center gap-3 text-fg"
        >
          <span className="grid size-20 place-items-center rounded-full border border-hairline">
            <Icon name="culture" size={36} />
          </span>
          <span className="bg-surface text-small">{cultures}</span>
        </m.div>
        <m.div style={{ opacity: reveal, y: lift }} className="grid justify-items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- placeholder render */}
          <img src="/images/products/cup-150.svg" alt="" width={160} height={160} />
          <span className="font-display text-h2 font-semibold">{result}</span>
        </m.div>
      </div>
    </div>
  );
}
