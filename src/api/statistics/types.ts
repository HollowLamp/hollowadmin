export interface Statistics {
  categoryCount: number;
  publishedArticleCount: number;
  publishedNoteCount: number;
  publishedThoughtCount: number;
  commentCount: number;
}

export interface ViewsStatistics {
  articleViews: number;
  noteViews: number;
}

export interface DailyViewEntry {
  date: string;
  articleViews: number;
  noteViews: number;
}

export type DailyViews = DailyViewEntry[];

export interface MonthlyViewEntry {
  year: number;
  month: number;
  articleViews: number;
  noteViews: number;
}

export type MonthlyViews = MonthlyViewEntry[];

export interface ContentWordCount {
  articleWordCount: number;
  noteWordCount: number;
  thoughtWordCount: number;
}
