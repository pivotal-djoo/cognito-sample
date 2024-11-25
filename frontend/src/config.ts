const cognitoUri = import.meta.env.VITE_COGNITO_URI;
const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const reservationsUri = import.meta.env.VITE_RESERVATIONS_URI;
const servicesUri = import.meta.env.VITE_SERVICES_URI;

export { clientId, cognitoUri, redirectUri, reservationsUri, servicesUri };
