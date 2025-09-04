import type { ReactNode } from "react";
import { WebSocketProvider } from "@/context/websocketProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
