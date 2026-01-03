import { createContext, ReactNode, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBranding, updateBranding } from "../data/mockApi";
import type { Branding } from "../types";

type BrandingContextValue = {
  branding: Branding | undefined;
  loading: boolean;
  update: (branding: Branding) => void;
};

const BrandingContext = createContext<BrandingContextValue | undefined>(undefined);

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["branding"],
    queryFn: fetchBranding,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: updateBranding,
    onSuccess: (next) => {
      queryClient.setQueryData(["branding"], next);
    },
  });

  const value = useMemo(
    () => ({
      branding: data,
      loading: isLoading,
      update: (branding: Branding) => mutation.mutate(branding),
    }),
    [data, isLoading, mutation],
  );

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => {
  const ctx = useContext(BrandingContext);
  if (!ctx) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return ctx;
};
