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
