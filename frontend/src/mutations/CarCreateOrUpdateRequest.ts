export type CarCreateOrUpdateRequest = {
  brand?: string;
  name?: string;
  passengers?: number;
  daily_price_huf: number;
  image: string;
};
