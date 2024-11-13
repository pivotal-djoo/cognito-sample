const cognitoUri = import.meta.env.VITE_COGNITO_URI;
const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

type TokenResponse = {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  timestamp: number;
};

type UserInfo = {
  given_name: string;
  family_name: string;
  date_of_birth: string;
};

const getStoredTokenResponse: () => TokenResponse | null = () => {
  const serializedTokenResponse = localStorage.getItem('tokenResponse');
  if (!serializedTokenResponse) {
    return null;
  }
  return JSON.parse(serializedTokenResponse) as TokenResponse;
};

export const isAuthenticated = () => {
  const tokenResponse = localStorage.getItem('tokenResponse');
  return !!tokenResponse;
};

export const isTokenExpired = () => {
  const tokenResponse = getStoredTokenResponse();
  if (!tokenResponse) {
    return true;
  }
  if (!tokenResponse.timestamp) {
    return true;
  }
  return tokenResponse.timestamp + tokenResponse.expires_in * 1000 < Date.now();
};

export const login = () => {
  window.location.href = `${cognitoUri}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

export const logout = () => {
  localStorage.removeItem('tokenResponse');
  window.location.href = `${cognitoUri}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;
};

export const handleLoginRedirect = async (code: string) => {
  const urlEncodedData = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: code,
    redirect_uri: redirectUri,
    scope: 'email',
  }).toString();

  return fetch(`${cognitoUri}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Received token response: ', data);
      const tokenResponse = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse));
    })
    .catch((error) => {
      console.error('Error exchanging code for tokens:', error);
    });
};

export const refreshTokens = async () => {
  const storedTokenResponse = getStoredTokenResponse();
  if (!storedTokenResponse) {
    return Promise.reject(new Error('No logged in user.'));
  }

  const urlEncodedData = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: storedTokenResponse.refresh_token,
  }).toString();

  return fetch(`${cognitoUri}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Refreshed tokens: ', data);
      const tokenResponse = {
        ...data,
        refresh_token: storedTokenResponse.refresh_token,
        timestamp: Date.now(),
      };
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse));
    })
    .catch((error) => {
      console.error('Error exchanging refresh token: ', error);
    });
};

export const getUserInfo: () => Promise<UserInfo | null> = async () => {
  const tokenResponse = getStoredTokenResponse();
  if (!tokenResponse) {
    return Promise.reject(new Error('No logged in user.'));
  }

  return fetch(`${cognitoUri}/oauth2/userInfo`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User info retrived:', data);
      return data as UserInfo;
    })
    .catch((error) => {
      console.error('Error retrieving user info: ', error);
      return null;
    });
};
