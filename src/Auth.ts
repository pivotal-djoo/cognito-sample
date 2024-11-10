const cognitoUri = import.meta.env.VITE_COGNITO_URI;
const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
};

const login = () => {
  window.location.href = `${cognitoUri}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

const logout = () => {
  localStorage.removeItem('accessToken');
  window.location.href = `${cognitoUri}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;
};

const handleLoginRedirect = (code: string) => {
  const urlEncodedData = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: code,
    redirect_uri: redirectUri,
    scope: 'email',
  }).toString();

  fetch(`${cognitoUri}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Login success:', data);
      localStorage.setItem('accessToken', data);
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
};

export { handleLoginRedirect, isAuthenticated, login, logout };
