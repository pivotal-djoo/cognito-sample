import Carousel from 'react-bootstrap/Carousel';
import Ceiling from './assets/ceiling.webp';
import Sauna2 from './assets/sauna2.webp';
import Spa from './assets/spa.jpg';

function Banners() {
  const bannerHeight = '75vh';

  return (
    <Carousel>
      <Carousel.Item>
        <img
          src={Spa}
          style={{
            width: '100vw',
            height: bannerHeight,
            objectFit: 'cover',
          }}
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={Sauna2}
          style={{
            width: '100vw',
            height: bannerHeight,
            objectFit: 'cover',
          }}
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src={Ceiling}
          style={{
            width: '100vw',
            height: bannerHeight,
            objectFit: 'cover',
          }}
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Banners;
