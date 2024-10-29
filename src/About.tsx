import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Pumpkins from './assets/pumpkins.jpg';

function About() {
  const navigate = useNavigate();

  return (
    <>
      <Image
        src={Pumpkins}
        style={{
          width: '100vw',
          height: '40vh',
          objectFit: 'cover',
          maxHeight: '35rem',
        }}
      />

      <div className="p-4 p-md-5" style={{ fontWeight: 200 }}>
        <p className="fs-5 mb-5">About Stealth Store</p>

        <p className="mb-2">
          <span className="text-info">Lorem ipsum dolor sit amet, </span>{' '}
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>

        <p className="fs-5 my-5">Our Facilities</p>

        <p className="mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud{' '}
          <span className="text-info"> exercitation ullamco laboris</span> nisi
          ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p className="fs-5 my-5">Our Services</p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>

        <Button
          variant="secondary"
          className="my-5"
          onClick={() => navigate('/services')}
        >
          View Our Services
        </Button>
      </div>
    </>
  );
}

export default About;
