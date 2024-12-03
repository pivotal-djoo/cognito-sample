import { Image, Spinner } from 'react-bootstrap';
import Candles from '../assets/candles.webp';

function Redirect() {
  return (
    <>
      <Image
        src={Candles}
        style={{
          width: '100vw',
          height: '40vh',
          objectFit: 'cover',
          maxHeight: '35rem',
        }}
      />

      <div
        className="p-4 p-md-5 my-5"
        style={{ fontWeight: 200, textAlign: 'center' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </>
  );
}

export default Redirect;
