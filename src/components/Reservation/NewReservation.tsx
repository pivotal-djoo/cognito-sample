import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Hydration from '../../assets/hydration.webp';
import { Service } from '../../models';
import { getServices } from '../../services/apiService';
import {
  getISOStringInLocalTimezone,
  getTimezoneAdjustedDate,
} from '../../utils/utils';

type NewReservationRequest = {
  service: string;
  date: string;
  durationInMinutes: number;
  location: string;
};

function NewReservation() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [reservation, updateReservation] = useState<NewReservationRequest>({
    service: '',
    date: '',
    durationInMinutes: 0,
    location: '',
  });
  const [dateTime, setDateTime] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    getServices().then((services) => {
      if (services) {
        setServices(services);
      }
    });
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  const getReservationDate = () => {
    const date = dateTime.split('T')[0];
    const time = dateTime.split('T')[1];
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    const reservationDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
    return getISOStringInLocalTimezone(reservationDate);
  };

  const handleRequestNewReservation = () => {
    setShowError(false);
    if (!reservation.service || reservation.service.length === 0) {
      setShowError(true);
      setErrorMessage('Please select a service.');
      window.scrollTo(0, 0);
      return false;
    }

    if (!dayjs(dateTime).isValid()) {
      setShowError(true);
      setErrorMessage('Please select a date and time.');
      window.scrollTo(0, 0);
      return false;
    } else if (dayjs(dateTime).isBefore(dayjs())) {
      setShowError(true);
      setErrorMessage('Please select a reservation time in the future.');
      window.scrollTo(0, 0);
      return false;
    }

    const updatedReservation = {
      ...reservation,
      date: getReservationDate(),
    };

    console.log('New reservation: ', updatedReservation);
    window.scrollTo(0, 0);
    navigate('/reservations');
  };

  const getMinDate = () => {
    return getTimezoneAdjustedDate(new Date()).toISOString().slice(0, 16);
  };

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
      <Container className="ms-0 me-0 ms-lg-5 me-lg-5">
        <div className="px-2 px-sm-5 py-4 py-sm-5" style={{ fontWeight: 200 }}>
          <Alert
            variant="danger"
            show={showError}
            onClose={() => setShowError(false)}
            dismissible
          >
            {errorMessage}
          </Alert>
          <p className="fs-5 mb-3">Request a new reservation</p>

          <Row className="my-5">
            <Col sm={4}>
              <p>Service: </p>
            </Col>
            <Col sm={8} className="mb-3">
              <DropdownButton
                id="dropdown-basic-button"
                variant="secondary"
                title={reservation.service || 'Select a service'}
              >
                {services.map((service) => (
                  <Dropdown.Item
                    key={service.name}
                    onClick={() => {
                      updateReservation({
                        ...reservation,
                        service: service.name,
                        durationInMinutes: service.duration,
                        location: 'Queen West',
                      });
                    }}
                  >
                    {service.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col sm={4}>
              <p>Date & Time</p>
            </Col>
            <Col sm={8} className="mb-3">
              <Form.Control
                type="datetime-local"
                placeholder="choose a date"
                value={dateTime}
                onChange={handleDateChange}
                min={getMinDate()}
                required
              />
            </Col>
          </Row>

          <Button
            className="mb-5"
            variant="secondary"
            onClick={handleRequestNewReservation}
          >
            Request a new reservation
          </Button>
        </div>
      </Container>
    </>
  );
}

export default NewReservation;
