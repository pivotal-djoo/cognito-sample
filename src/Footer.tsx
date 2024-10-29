import { Col, Container, Image, Row } from 'react-bootstrap';
import FacebookLogo from './assets/facebook.png';
import InstagramLogo from './assets/instagram.png';
import TwitterLogo from './assets/twitter.png';
import ViteLogo from '/vite.svg';

function Footer() {
  return (
    <footer>
      <Container fluid>
        <Row
          className="bg-secondary text-white py-5"
          style={{ fontWeight: 200 }}
        >
          <Col md={3} className="text-center">
            <Image
              src={ViteLogo}
              alt="Logo"
              style={{ width: '60px', height: '60px' }}
            />
            <p className="my-2 fs-3">Stealth Store</p>
          </Col>
          <Col md={3} className="text-center mt-5 mt-md-0">
            <p className="mb-3 fs-5">ADDRESS</p>
            <p className="my-0">123 Queen Street West</p>
            <p className="my-0">Toronto, ON A1B 2C3</p>
          </Col>
          <Col md={3} className="text-center mt-5 mt-md-0">
            <p className="mb-3 fs-5">PHONE</p>
            <p className="my-0">(123) 456-7890</p>
            <p className="mt-5 mt-md-4 mb-3 fs-5">EMAIL</p>
            <a
              href="mailto:contact@stealthstore.com"
              style={{ color: 'lightblue' }}
            >
              contact@stealthstore.com
            </a>
          </Col>
          <Col md={3} className="text-center mt-5 mt-md-0">
            <p className="mb-3 fs-5">FOLLOW US</p>
            <a href="https://instagram.com" target="_blank">
              <Image
                src={InstagramLogo}
                style={{ width: '30px', height: '30px' }}
              />
            </a>
            <a href="https://facebook.com" target="_blank" className="mx-2">
              <Image
                src={FacebookLogo}
                style={{ width: '30px', height: '30px' }}
              />
            </a>
            <a href="https://twitter.com" target="_blank">
              <Image
                src={TwitterLogo}
                style={{ width: '30px', height: '30px' }}
              />
            </a>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center' }}>© Stealth Store</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
