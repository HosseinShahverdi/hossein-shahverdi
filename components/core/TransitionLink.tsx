"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** A Link that plays the world curtain before navigating. Modifier-clicks behave normally. */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
