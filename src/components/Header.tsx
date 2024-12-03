import { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import { logout } from '../services/authService';
import ViteLogo from '/vite.svg';

function Header() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userPictureUri, setUserPictureUri] = useState<string | null>(null);
  const { isLoggedIn, login, userInfo } = useLogin();

  const handleClick = (path: string) => {
    setExpanded(false);
    window.scrollTo(0, 0);
    navigate(path);
  };

  useEffect(() => {
    if (userInfo) {
      setUserFirstName(userInfo.given_name);
      if (userInfo.picture) {
        setUserPictureUri(userInfo.picture);
      }
    }
  }, [userInfo]);

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
            <Nav.Link onClick={() => handleClick('/reservations')}>
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
