"use client";

import { PullToRefresh } from "@/components/pull-to-refresh";
import type { ReactNode } from "react";

export function PullToRefreshWrapper({ children }: { children: ReactNode }) {
  return <PullToRefresh>{children}</PullToRefresh>;
}