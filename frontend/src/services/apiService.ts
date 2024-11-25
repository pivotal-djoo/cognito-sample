import { reservationsUri, servicesUri } from '../config';
import { Reservation, ReservationRequest, Service } from '../models';
import { getIdToken, getUserEmail } from './authService';

export async function getServices(): Promise<Service[]> {
  return fetch(servicesUri)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Unable to retrieve services:', error);
    });
}

export async function getAllReservations(): Promise<Reservation[]> {
  const userEmail = getUserEmail();
  if (!userEmail) {
    return Promise.reject(new Error('No logged in user.'));
  }
  const idToken = getIdToken();

  return fetch(reservationsUri, {
    headers: { Authorization: `Bearer ${idToken}` },
  }).then((response) => response.json());
}

export async function requestReservation(
  reservation: ReservationRequest
): Promise<void> {
  const userEmail = getUserEmail();
  if (!userEmail) {
    return Promise.reject(new Error('No logged in user.'));
  }
  const idToken = getIdToken();

  return fetch(reservationsUri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation),
  }).then(() => {
    return;
  });
}
