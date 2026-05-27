import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import UtilsProvider from "./UtilsProvider";

const query = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Provider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={query}>
      <UtilsProvider>{children}</UtilsProvider>
    </QueryClientProvider>
  );
}
