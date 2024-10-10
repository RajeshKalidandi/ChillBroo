declare module 'google-trends-api' {
  interface TrendOptions {
    trendDate: Date;
    geo: string;
  }

  interface TrendResult {
    default: {
      trendingSearchesDays: Array<{
        trendingSearches: Array<{
          title: {
            query: string;
          };
          formattedTraffic: string;
        }>;
      }>;
    };
  }

  export function dailyTrends(options: TrendOptions): Promise<string>;
}