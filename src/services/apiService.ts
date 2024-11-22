import { servicesUri } from '../config';
import { Service } from '../models';

export function getServices(): Promise<Service[] | void> {
  return fetch(servicesUri)
    .then((response) => response.json() as unknown as Service[])
    .catch((error) => {
      console.error('Unable to retrieve services:', error);
    });
}
