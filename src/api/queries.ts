import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, Report, reportSchema, Station } from "./client";
import { CACHE_KEYS } from "./queryClient";

export const useReports = <T = Report[]>(select?: (data: Report[]) => T) =>
  useQuery({
    queryKey: CACHE_KEYS.reports,
    queryFn: api.getReports,
    staleTime: 1000 * 60,
    select,
  });

export const useSubmitReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.postReport,
    onSuccess: async (newReport: unknown) => {
      if (__DEV__) return;

      // TODO: Doesn't work with the mock
      const parsedReport = reportSchema.parse(newReport);

      queryClient.setQueryData(CACHE_KEYS.reports, (oldReports: Report[]) => [
        ...oldReports,
        parsedReport,
      ]);
    },
  });
};

export const useStations = <T = Record<string, Station>>(
  select?: (data: Record<string, Station>) => T
) =>
  useQuery({
    queryKey: CACHE_KEYS.stations,
    queryFn: api.getStations,
    select,
  });

export const useLines = () =>
  useQuery({
    queryKey: CACHE_KEYS.lines,
    queryFn: api.getLines,
  });
