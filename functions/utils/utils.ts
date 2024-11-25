import dayjs from 'dayjs';

export function populatePastField(reservations: Record<string, any>[]) {
  return reservations.map((reservation) => ({
    ...reservation,
    past: dayjs(reservation.date).isBefore(Date.now()),
  }));
}
