
export type BookingPublic = {
  car_id: number;
  start_date: string;
  end_date: string;
};

export type BookingFull = BookingPublic & {
  name: string;
  email: string;
  address: string;
  phone: string;
  total_price: number;
};
