import { useEffect, useState } from 'react';
import { Accordion, Alert, Button, Image, Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sauna from '../../assets/sauna.webp';
import { Service } from '../../models';
import { getServices } from '../../services/apiService';
import { isAuthenticated, login } from '../../services/authService';

function AccordionPlaceholders() {
  return (
    <>
      <Accordion.Item eventKey="placeholder" className="slide-in">
        <Placeholder as={Accordion.Header} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
      </Accordion.Item>
      <Accordion.Item eventKey="placeholder" className="slide-in">
        <Placeholder as={Accordion.Header} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
      </Accordion.Item>
      <Accordion.Item eventKey="placeholder" className="slide-in">
        <Placeholder as={Accordion.Header} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
      </Accordion.Item>
      <Accordion.Item eventKey="placeholder" className="slide-in">
        <Placeholder as={Accordion.Header} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
      </Accordion.Item>
    </>
  );
}

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((services) => {
        setServices([]);
        const servicesList = services;
        let servicesIndex = 0;
        const interval = setInterval(() => {
          if (servicesIndex < servicesList.length) {
            setServices((prevServices) => {
              const reservation = servicesList[servicesIndex];
              servicesIndex += 1;
              return [...prevServices, reservation];
            });
          } else {
            clearInterval(interval);
          }
        }, 50);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Unable to retrieve services. Please try again later.');
        setShowError(true);
        setLoading(false);
      });
  }, []);

  const handleRequestReservation = (service: Service) => {
    if (isAuthenticated()) {
      navigate('/request-reservation', { state: { selectedService: service } });
    } else {
      login();
    }
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
        <Alert
          className="mb-5"
          variant="danger"
          show={showError}
          onClose={() => setShowError(false)}
          dismissible
        >
          {errorMessage}
        </Alert>
        <p className="fs-5 mb-5">Available services</p>

        <p className="mb-2">
          <span className="text-primary">Lorem ipsum dolor sit amet, </span>{' '}
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          laborum.
        </p>

        <Accordion className="my-5">
          {services.length > 0
            ? services.map((service, index) => (
                <Accordion.Item
                  eventKey={`${index} ${service.name}`}
                  key={index}
                  className="slide-in"
                >
                  <Accordion.Header>{service.name}</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => handleRequestReservation(service)}
                    >
                      Request a reservation
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              ))
            : loading && <AccordionPlaceholders />}
        </Accordion>
      </div>
    </>
  );
}

export default Services;
