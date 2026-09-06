export type CarCreateOrUpdateRequest = {
  brand: string;
  model: string;
  passengers: number;
  daily_price_huf: number;
  image: string;
  enabled: boolean;
};
