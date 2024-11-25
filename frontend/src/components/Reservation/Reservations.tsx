import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Image,
  Placeholder,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Hydration from '../../assets/hydration.webp';
import { getAllReservations } from '../../services/apiService';
import {
  formatDate,
  formatTimeFromMinutes,
  sortByDate,
} from '../../utils/utils';

type Reservation = {
  service: string;
  date: string;
  durationInMinutes: number;
  location: string;
  past: boolean;
  status: string;
};

function ReservationPlaceholder() {
  return (
    <Card className="slide-in my-3">
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow" className="mb-3">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={8} className="my-2" />
          <Placeholder xs={6} className="my-2" />
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={4} className="my-2" />
          </Placeholder>
        </Placeholder>
      </Card.Body>
    </Card>
  );
}

function ReservationCard({
  reservation,
  showStatus = false,
}: {
  reservation: Reservation;
  showStatus?: boolean;
}) {
  return (
    <Card className="slide-in my-3">
      <Card.Body>
        <p className="fs-4">{reservation.service}</p>
        <p>{formatDate(reservation.date)}</p>
        <p>Duration: {formatTimeFromMinutes(reservation.durationInMinutes)}</p>
        {showStatus && <p>Status: {reservation.status}</p>}
      </Card.Body>
    </Card>
  );
}

function Reservations() {
  const navigate = useNavigate();
  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[]
  >([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReservations()
      .then((reservations) => {
        setShowError(false);
        setLoading(true);
        setUpcomingReservations([]);
        setPastReservations([]);

        const sortedReservations = sortByDate(reservations);
        const upcomingList = sortedReservations.filter(
          (reservation) => !reservation.past
        );
        const pastList = sortedReservations
          .filter((reservation) => reservation.past)
          .reverse();

        let upcomingListIndex = 0;
        let pastListIndex = 0;
        const interval = setInterval(() => {
          if (upcomingListIndex < upcomingList.length) {
            setUpcomingReservations((prevReservations) => {
              const reservation = upcomingList[upcomingListIndex];
              upcomingListIndex += 1;
              return [...prevReservations, reservation];
            });
          } else if (pastListIndex < pastList.length) {
            setPastReservations((prevReservations) => {
              const reservation = pastList[pastListIndex];
              pastListIndex += 1;
              return [...prevReservations, reservation];
            });
          } else {
            clearInterval(interval);
            setLoading(false);
          }
        }, 100);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          'Error retrieving reservations. Please try again later.'
        );
        setShowError(true);
        setLoading(false);
      });
  }, []);

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
            className="mb-5"
            variant="danger"
            show={showError}
            onClose={() => setShowError(false)}
            dismissible
          >
            {errorMessage}
          </Alert>
          <p className="fs-5 mb-3">New reservation</p>
          <Button
            className="mb-5"
            variant="secondary"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/request-reservation');
            }}
          >
            Request a new reservation
          </Button>

          <p className="fs-5 my-3">Upcoming reservations</p>
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.date}
                reservation={reservation}
                showStatus={true}
              />
            ))
          ) : loading ? (
            <>
              <ReservationPlaceholder />
              <ReservationPlaceholder />
            </>
          ) : (
            <p className="mb-5">No upcoming reservations found</p>
          )}

          <p className="my-3">&nbsp;</p>

          <p className="fs-5 my-3">Past reservations</p>
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationCard
                reservation={reservation}
                key={reservation.date}
              />
            ))
          ) : loading ? (
            <ReservationPlaceholder />
          ) : (
            <p className="mb-5">No past reservations found</p>
          )}
        </div>
      </Container>
    </>
  );
}

export default Reservations;
