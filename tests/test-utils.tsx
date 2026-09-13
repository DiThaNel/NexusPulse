import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/components/language-provider";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  locale?: "es" | "en";
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const queryClient = options?.queryClient || createTestQueryClient();

  if (options?.locale && typeof window !== "undefined") {
    localStorage.setItem("nexus-pulse-lang", options.locale);
  }

  function AllProviders({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>{children}</LanguageProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: AllProviders, ...options }),
    queryClient,
  };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
