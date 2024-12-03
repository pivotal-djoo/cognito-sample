import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  login as authLogin,
  getUserInfo,
  isAuthenticated,
  isTokenExpired,
  obtainToken,
  refreshTokens,
  UserInfo,
} from '../services/authService';

function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const saveCurrentPath = () => {
    localStorage.setItem('currentPath', location.pathname);
  };

  const restoreLastPath = () => {
    const lastPath = localStorage.getItem('currentPath');
    if (lastPath) {
      navigate(lastPath);
    }
    localStorage.removeItem('currentPath');
  };

  const login = () => {
    saveCurrentPath();
    authLogin();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      obtainToken(code).then(() => {
        searchParams.delete('code');
        setSearchParams(searchParams);

        getUserInfo().then((userInfo) => {
          if (userInfo) {
            setUserInfo(userInfo);
            setIsLoggedIn(isAuthenticated());
            restoreLastPath();
          }
        });
      });
    } else if (isAuthenticated() && isTokenExpired()) {
      refreshTokens().catch(() => {
        setIsLoggedIn(false);
      });
    } else if (isAuthenticated() && !userInfo) {
      getUserInfo().then((userInfo) => {
        if (userInfo) {
          setUserInfo(userInfo);
        }
      });
    }
  }, []);

  return {
    isLoggedIn,
    login,
    userInfo,
  };
}

export default useLogin;
