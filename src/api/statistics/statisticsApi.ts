import { axiosInstance } from "../config";
import {
  ContentWordCount,
  DailyViews,
  MonthlyViews,
  Statistics,
  ViewsStatistics,
} from "./types";

export const getStatistics = async (): Promise<Statistics> => {
  const response = await axiosInstance.get<Statistics>("/statistics/counts");
  return response.data;
};

export const getViewsStatistics = async (): Promise<ViewsStatistics> => {
  const response = await axiosInstance.get<ViewsStatistics>(
    "/statistics/views"
  );
  return response.data;
};

export const getDailyViews = async (
  startDate: string,
  endDate: string
): Promise<DailyViews> => {
  const response = await axiosInstance.get<DailyViews>(
    "/statistics/daily-views",
    {
      params: { startDate, endDate },
    }
  );
  return response.data;
};
export const getContentWordCount = async (): Promise<ContentWordCount> => {
  const response = await axiosInstance.get<ContentWordCount>(
    "/statistics/content-word-count"
  );
  return response.data;
};

export const getMonthlyViews = async (
  startDate: string,
  endDate: string
): Promise<MonthlyViews> => {
  const response = await axiosInstance.get<MonthlyViews>(
    "/statistics/monthly-views",
    {
      params: { startDate, endDate },
    }
  );
  return response.data;
};
