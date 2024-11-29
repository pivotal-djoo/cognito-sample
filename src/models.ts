export interface Service {
  name: string;
  duration: number;
}

export interface Reservation {
  service: string;
  durationInMinutes: number;
  location: string;
  date: string;
  id: string;
  email: string;
  status: string;
  past: boolean;
}

export type ReservationRequest = Omit<
  Reservation,
  'id' | 'email' | 'status' | 'past'
>;
