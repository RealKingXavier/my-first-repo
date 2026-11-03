"use client";

import type { AnchorHTMLAttributes } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

// A plain anchor that records a cookieless analytics event on click.
export function TrackedLink({
  event,
  props,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: TrackEvent; props?: Record<string, string> }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, props);
        onClick?.(e);
      }}
    />
  );
}
