"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getSiteStatus,
  subscribeSiteStatus,
  type SiteStatus,
} from "@/lib/site-status";

const SiteStatusContext = createContext<SiteStatus | null>(null);

export function SiteStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SiteStatus>(() => getSiteStatus());

  useEffect(() => {
    return subscribeSiteStatus(() => {
      setStatus(getSiteStatus());
    });
  }, []);

  return <SiteStatusContext.Provider value={status}>{children}</SiteStatusContext.Provider>;
}

export function useSiteStatus(): SiteStatus {
  const context = useContext(SiteStatusContext);

  if (!context) {
    throw new Error("useSiteStatus must be used within SiteStatusProvider");
  }

  return context;
}
