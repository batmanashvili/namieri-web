import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/*
 * Line icons drawn on a 24 px grid with a 1.5 px stroke, to sit with the
 * fine line-art illustrations. Decorative by default; pass `label` when the
 * icon is the only content of a control.
 */
const paths = {
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  cart: "M3 4h2.2l2.1 10.1a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.1M9.5 20.2a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4ZM17 20.2a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Z",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert:
    "M12 8v5M12 16.5v.01M10.3 3.9L2.6 17.3A2 2 0 0 0 4.3 20.3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  info: "M12 11v5M12 7.5v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  checkCircle: "M8.5 12.5l2.5 2.5 4.5-5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3.5 9h17M3.5 15h17M12 3c2.2 2.4 3.4 5.6 3.4 9s-1.2 6.6-3.4 9c-2.2-2.4-3.4-5.6-3.4-9S9.8 5.4 12 3Z",
  phone:
    "M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M3.5 6.5h17v11h-17zM4 7l8 6 8-6",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11ZM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z",
  instagram:
    "M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4ZM12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6ZM17.2 6.9v.01",
  facebook:
    "M14.5 3.5h-2a4 4 0 0 0-4 4v2.5H6v3.5h2.5V21h3.5v-7.5h2.7l.6-3.5H12V8a1 1 0 0 1 1-1h2.5Z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  drop: "M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z",
  culture:
    "M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14ZM5 19l7-7",
  shield:
    "M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3ZM8.8 12l2.2 2.2 4.3-4.4",
  spoon:
    "M14.5 3.5c2.5 0 4 2 4 4.3 0 2.6-2.2 4.2-4.6 4.2L6 20.5 3.5 18l8.5-8.6c0-2.6 1.4-5.9 2.5-5.9Z",
  sparkle: "M12 3.5l1.8 6.7 6.7 1.8-6.7 1.8L12 20.5l-1.8-6.7-6.7-1.8 6.7-1.8L12 3.5Z",
  milkCan:
    "M9 3.5h6M10 3.5V6L7.5 9v10.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9L14 6V3.5M7.5 12.5h9M10.5 16l1.2 1.2 2.3-2.4",
  hourglass:
    "M7 3.5h10M7 20.5h10M8 3.5c0 4.2 8 4.6 8 8.5s-8 4.3-8 8.5M16 3.5c0 4.2-8 4.6-8 8.5s8 4.3 8 8.5",
  strainer:
    "M3.5 8.5h13a6.5 6.5 0 0 1-13 0ZM16.5 8.5l4-3M7.5 11h.01M10 13h.01M12.5 11h.01M10 18v2.5",
  repeat:
    "M4.5 11a7.5 7.5 0 0 1 13-4.6l1.5 1.6M19 3.5V8h-4.5M19.5 13a7.5 7.5 0 0 1-13 4.6L5 16M5 20.5V16h4.5",
  dropOff: "M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11ZM4.5 4.5l15 15",
  cubeOff:
    "M12 3.5l7.5 4v9L12 20.5l-7.5-4v-9L12 3.5ZM4.5 7.5 12 11.5l7.5-4M12 11.5v9M3.5 3.5l17 17",
  store:
    "M4 9.5V20h16V9.5M3 9.5l2-5.5h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0ZM9.5 20v-5h5v5",
  message:
    "M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5ZM8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01",
  map: "M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4ZM9 4v14M15 6v14",
} as const;

export type IconName = keyof typeof paths;

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
  size?: number;
};

export function Icon({ name, label, size = 24, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
