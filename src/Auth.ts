const cognitoUri = import.meta.env.VITE_COGNITO_URI;
const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

type TokenResponse = {
  id_token: string;
  access_token: string;
  refresh_token: string;
};

type UserInfo = {
  given_name: string;
  family_name: string;
  date_of_birth: string;
};

export const isAuthenticated = () => {
  const tokenResponse = localStorage.getItem('tokenResponse');
  return !!tokenResponse;
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
      console.log('Login success:', data);
      localStorage.setItem('tokenResponse', JSON.stringify(data));
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
};

export const getUserInfo: () => Promise<UserInfo | null> = async () => {
  const serializedTokenResponse = localStorage.getItem('tokenResponse');

  if (!serializedTokenResponse) {
    return Promise.reject(new Error('No logged in user.'));
  }

  const tokenResponse = JSON.parse(serializedTokenResponse) as TokenResponse;

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
      console.error('Error retrieving user info:', error);
      return null;
    });
};
