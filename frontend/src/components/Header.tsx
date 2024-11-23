import { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getUserInfo,
  handleLoginRedirect,
  isAuthenticated,
  isTokenExpired,
  login,
  logout,
  refreshTokens,
} from '../services/authService';
import ViteLogo from '/vite.svg';

function Header() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userFirstName, setUserFirstName] = useState('');
  const [userPictureUri, setUserPictureUri] = useState<string | null>(null);

  const handleClick = (path: string) => {
    setExpanded(false);
    window.scrollTo(0, 0);
    navigate(path);
  };

  const showLoggedInUser = async () => {
    const userInfo = await getUserInfo();
    if (userInfo) {
      setUserFirstName(userInfo.given_name);
      if (userInfo.picture) {
        setUserPictureUri(userInfo.picture);
      }
    }
  };

  const updateHeader = async (code: string | null) => {
    if (code) {
      await handleLoginRedirect(code);
      searchParams.delete('code');
      setSearchParams(searchParams);
      setIsLoggedIn(isAuthenticated());
    } else if (isAuthenticated() && isTokenExpired()) {
      await refreshTokens().catch((error) => {
        console.log('refresh token failed. showing user logged out. ', error);
        setIsLoggedIn(false);
      });
    }
    if (isAuthenticated()) {
      await showLoggedInUser();
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    updateHeader(code);
  }, []);

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      className="bg-body-tertiary"
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: 'pointer' }}
          onClick={() => handleClick('/')}
        >
          <Image
            alt=""
            src={ViteLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Stealth Store
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link onClick={() => handleClick('/about')}>About</Nav.Link>
            <Nav.Link onClick={() => handleClick('/services')}>
              Services
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                if (isLoggedIn) {
                  handleClick('/reservations');
                } else {
                  login();
                }
              }}
            >
              Reservations
            </Nav.Link>
            <Nav.Link onClick={() => handleClick('/contact')}>Contact</Nav.Link>
          </Nav>
          {userFirstName && (
            <div className="d-flex my-2 my-lg-0">
              <Navbar.Text>Welcome, {userFirstName}</Navbar.Text>
              {userPictureUri && (
                <>
                  <Navbar.Text className="mx-1 mx-lg-2"></Navbar.Text>
                  <Image
                    src={userPictureUri}
                    roundedCircle
                    width="40"
                    height="40"
                  />
                </>
              )}
            </div>
          )}
          <Form className="d-flex my-2 my-lg-0">
            {isLoggedIn ? (
              <>
                <Navbar.Text className="mx-0 mx-lg-2"></Navbar.Text>
                <Button variant="outline-secondary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline-secondary" onClick={login}>
                Login
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;