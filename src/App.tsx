import { Col, Image, Row } from 'react-bootstrap';
import './App.css';
import Bath from './assets/bath.jpg';
import Seats from './assets/seats.jpg';
import Carousel from './Banners';
import Footer from './Footer';
import Header from './Header';

function App() {
  return (
    <>
      <Header />
      <Carousel />

      <Row
        style={{
          maxWidth: '55rem',
          marginTop: '3rem',
          marginBottom: '3rem',
          width: '100vw',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Col xs={12} md={7} style={{ maxWidth: '100vw' }}>
          <h2 className="featurette-heading fw-normal lh-1">First feature</h2>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </Col>
        <Col
          xs={0}
          md={5}
          style={{ maxWidth: '100vw' }}
          className="d-none d-md-block"
        >
          <Image
            src={Bath}
            style={{
              width: '20rem',
              height: '70vh',
              objectFit: 'cover',
              maxHeight: '35rem',
            }}
          />
        </Col>
      </Row>
      <Row
        style={{
          maxWidth: '55rem',
          marginTop: '3rem',
          marginBottom: '3rem',
          width: '100vw',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Col
          xs={0}
          md={5}
          style={{ maxWidth: '100vw' }}
          className="d-none d-md-block"
        >
          <Image
            src={Seats}
            style={{
              width: '20rem',
              height: '70vh',
              maxHeight: '35rem',
              objectFit: 'cover',
            }}
          />
        </Col>
        <Col xs={12} md={7} style={{ maxWidth: '100vw' }}>
          <h2 className="featurette-heading fw-normal lh-1">Second feature</h2>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </Col>
      </Row>

      <Footer />
    </>
  );
}

export default App;
