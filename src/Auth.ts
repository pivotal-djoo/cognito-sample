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

type Identity = {
  providerName: string;
};

type FacebookPicturePayload = {
  data: {
    url: string;
  };
};

type UserInfo = {
  identities: string;
  given_name: string;
  family_name: string;
  date_of_birth: string;
  picture: string;
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
  if (!tokenResponse.timestamp || !tokenResponse.expires_in) {
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
      console.error('Unable to exchange code for token response:', error);
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
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('Refreshed tokens: ', data);
      const tokenResponse = {
        ...data,
        refresh_token: storedTokenResponse.refresh_token,
        timestamp: Date.now(),
      };
      localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse));
    })
    .catch((error) => {
      const errorMessage = 'Unable to exchange refresh token: ' + error.message;
      console.error(errorMessage);
      localStorage.removeItem('tokenResponse');
      return Promise.reject(new Error(errorMessage));
    });
};

const extractUserInfo = (userInfo: UserInfo) => {
  if (userInfo.picture && userInfo.identities) {
    const identities = JSON.parse(userInfo.identities) as Identity[];
    if (identities && identities.length > 0) {
      switch (identities[0].providerName) {
        case 'Facebook': {
          const picturePayload = JSON.parse(
            userInfo.picture
          ) as FacebookPicturePayload;
          userInfo.picture = decodeURI(picturePayload.data.url);
          break;
        }
        case 'Google': {
          userInfo.picture = decodeURI(userInfo.picture);
          break;
        }
      }
    }
  }
  return userInfo;
};

export const getUserInfo: () => Promise<UserInfo | null> = async () => {
  const tokenResponse = getStoredTokenResponse();
  if (!tokenResponse || !tokenResponse.access_token) {
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
      return extractUserInfo(data);
    })
    .catch((error) => {
      console.error('Unable to retrieve user info: ', error);
      return null;
    });
};
