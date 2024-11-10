import { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleLoginRedirect, isAuthenticated, login, logout } from './Auth';
import ViteLogo from '/vite.svg';

function Header() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [expanded, setExpanded] = useState(false);

  const handleClick = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('useEffect with code: ', code);
    if (code) {
      handleLoginRedirect(code);
      searchParams.delete('code');
      setSearchParams(searchParams);
    }
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
            <Nav.Link onClick={() => handleClick('/testimonials')}>
              Testimonials
            </Nav.Link>
            <Nav.Link onClick={() => handleClick('/contact')}>Contact</Nav.Link>
          </Nav>
          <Form className="d-flex my-2, my-lg-0">
            {isAuthenticated() ? (
              <Button variant="outline-secondary" onClick={logout}>
                Logout
              </Button>
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
