import { useQuery } from "@tanstack/react-query";
import {
  getContentWordCount,
  getDailyViews,
  getMonthlyViews,
  getStatistics,
  getViewsStatistics,
} from "@/api/statistics/statisticsApi";
import {
  ContentWordCount,
  DailyViews,
  MonthlyViews,
  Statistics,
  ViewsStatistics,
} from "@/api/statistics/types";

export const useGetStatistics = () => {
  return useQuery<Statistics>({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });
};

export const useGetViewsStatistics = () => {
  return useQuery<ViewsStatistics>({
    queryKey: ["viewsStatistics"],
    queryFn: getViewsStatistics,
  });
};

export const useGetDailyViews = (startDate: string, endDate: string) => {
  return useQuery<DailyViews>({
    queryKey: ["dailyViews", startDate, endDate],
    queryFn: () => getDailyViews(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useGetContentWordCount = () => {
  return useQuery<ContentWordCount>({
    queryKey: ["contentWordCount"],
    queryFn: getContentWordCount,
  });
};

export const useGetMonthlyViews = (startDate: string, endDate: string) => {
  return useQuery<MonthlyViews>({
    queryKey: ["monthlyViews", startDate, endDate],
    queryFn: () => getMonthlyViews(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
