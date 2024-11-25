import { useEffect, useState } from 'react';
import { Accordion, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sauna from '../../assets/sauna.webp';
import { Service } from '../../models';
import { getServices } from '../../services/apiService';

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((services) => {
      if (services) {
        setServices(services);
      }
    });
  }, []);

  const handleRequestReservation = (service: Service) => {
    navigate('/request-reservation', { state: { selectedService: service } });
  };

  return (
    <>
      <Image
        src={Sauna}
        style={{
          width: '100vw',
          height: '40vh',
          objectFit: 'cover',
          maxHeight: '35rem',
        }}
      />

      <div className="p-4 p-md-5" style={{ fontWeight: 200 }}>
        <p className="fs-5 mb-5">Available services</p>

        <p className="mb-2">
          <span className="text-primary">Lorem ipsum dolor sit amet, </span>{' '}
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          laborum.
        </p>

        <Accordion className="my-5">
          {services.map((service, index) => (
            <Accordion.Item eventKey={`${index} ${service.name}`} key={index}>
              <Accordion.Header>{service.name}</Accordion.Header>
              <Accordion.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => handleRequestReservation(service)}
                >
                  Request a reservation
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default Services;
