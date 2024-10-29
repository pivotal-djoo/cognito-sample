import { Button, Col, Form, Image, Row } from 'react-bootstrap';
import Hydration from './assets/hydration.webp';

function About() {
  return (
    <>
      <Image
        src={Hydration}
        style={{
          width: '100vw',
          height: '40vh',
          objectFit: 'cover',
          maxHeight: '35rem',
        }}
      />
      <div className="p-4 p-md-5" style={{ fontWeight: 200 }}>
        <p className="fs-5 mb-5">
          Login to your <span style={{ fontWeight: '500' }}>Stealth Store</span>{' '}
          account:
        </p>

        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control placeholder="email@example.com" />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="my-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control type="password" placeholder="Password" />
            </Col>
          </Form.Group>

          <p className="my-4">
            <a style={{ cursor: 'pointer' }} onClick={() => {}}>
              Forgot password?
            </a>
          </p>

          <Button variant="secondary" type="submit">
            Login
          </Button>
        </Form>

        <Row className="fs-5 my-5">
          <Col sm={4}>
            Or sign-in with:
            <p style={{ fontSize: '1rem' }}>(and skip registration)</p>
          </Col>
          <Col sm={4}>Google</Col>
          <Col sm={4}>Facebook</Col>
          <Col sm={4}></Col>
          <Col sm={4}>Instagram</Col>
          <Col sm={4}>Twitter</Col>
        </Row>

        <p className="fs-5 my-5">Don't have an account?</p>

        <Button variant="secondary">Register via Email</Button>
      </div>
    </>
  );
}

export default About;
