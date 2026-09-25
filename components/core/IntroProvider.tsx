"use client";

import { createContext, useContext, useState } from "react";

type IntroState = { ready: boolean; setReady: (v: boolean) => void };
const IntroContext = createContext<IntroState>({ ready: true, setReady: () => {} });

/** `ready` flips to true once the intro loader has finished (or was skipped). */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return <IntroContext.Provider value={{ ready, setReady }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
