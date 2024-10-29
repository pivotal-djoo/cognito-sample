import { useState } from 'react';
import { Button, Container, Form, Image, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ViteLogo from '/vite.svg';

function Header() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClick = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      className="bg-body-tertiary"
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
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
            <Button
              variant="outline-secondary"
              onClick={() => handleClick('login')}
            >
              Login
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
