import { QueryClientProvider } from "./query-client";
import { RouterProvider } from "./router";

export function Providers() {
  return (
    <QueryClientProvider>
        <RouterProvider />
    </QueryClientProvider>
  );
}
