import { reservationsUri, servicesUri } from '../config';
import { Reservation, ReservationRequest, Service } from '../models';
import { getIdToken, getUserEmail, refreshTokens } from './authService';

export async function getServices(): Promise<Service[]> {
  return fetch(servicesUri).then(async (response) => {
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    return response.json();
  });
}

export async function getAllReservations(): Promise<Reservation[]> {
  const userEmail = getUserEmail();
  if (!userEmail) {
    return Promise.reject(new Error('No logged in user.'));
  }
  const idToken = getIdToken();
  const request = {
    headers: { Authorization: `Bearer ${idToken}` },
  };

  return fetch(reservationsUri, request)
    .then(async (response) => {
      if (response.status === 401) {
        await refreshTokens();
        return fetch(reservationsUri, request);
      }
      return response;
    })
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error(await response.text());
      }
      return response.json();
    });
}

export async function requestReservation(
  reservation: ReservationRequest
): Promise<void> {
  const userEmail = getUserEmail();
  if (!userEmail) {
    return Promise.reject(new Error('No logged in user.'));
  }
  const idToken = getIdToken();
  const request = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation),
  };

  return fetch(reservationsUri, request)
    .then(async (response) => {
      if (response.status === 401) {
        await refreshTokens();
        return fetch(reservationsUri, request);
      }
      return response;
    })
    .then(async (response) => {
      if (response.status !== 201) {
        throw new Error(await response.text());
      }
    });
}
