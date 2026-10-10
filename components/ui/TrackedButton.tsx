"use client";

import { track, type AnalyticsEvent, type AnalyticsEventMap } from "@/lib/analytics";
import { Button, type ButtonProps } from "./Button";

type TrackedButtonProps<E extends AnalyticsEvent> = ButtonProps & {
  event: E;
  params: AnalyticsEventMap[E];
};

/**
 * A Button (or button link) that records an analytics event on click, so
 * server components can place tracked CTAs. Nothing is sent without consent.
 */
export function TrackedButton<E extends AnalyticsEvent>({
  event,
  params,
  ...props
}: TrackedButtonProps<E>) {
  return <Button {...(props as ButtonProps)} onClick={() => track(event, params)} />;
}
