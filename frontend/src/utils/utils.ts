import dayjs from 'dayjs';
import 'dayjs/locale/en';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Reservation } from '../models';

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export function formatDate(date: string, locale: string = 'en') {
  dayjs.locale(locale);
  return dayjs(date).format('LLLL');
}

export function formatTimeFromMinutes(minutes: number, locale: string = 'en') {
  dayjs.locale(locale);

  const duration = dayjs.duration(minutes, 'minutes');
  const hours = Math.floor(duration.asHours());
  const minutesRemaining = duration.minutes();
  const formattedDuration =
    (hours > 0
      ? `${hours} ` +
        (locale === 'en' ? 'hour' : 'heure') +
        (hours > 1 ? 's' : '')
      : '') +
    ` ${minutesRemaining} ` +
    (locale === 'en' ? 'minute' : 'minute') +
    (minutesRemaining > 1 ? 's' : '');

  return formattedDuration.trim();
}

export function getTimezoneAdjustedDate(date: Date) {
  const offsetInMinutes = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - offsetInMinutes);
  return date;
}

export function getISOStringInLocalTimezone(date: Date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mmZ');
}

export function sortByDate(reservations: Reservation[]): Reservation[] {
  return reservations.sort((a, b) => {
    return dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 0;
  });
}
