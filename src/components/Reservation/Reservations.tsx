import { useEffect, useState } from 'react';
import { Alert, Button, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Hydration from '../../assets/hydration.webp';
import useLogin from '../../hooks/useLogin';
import { Reservation } from '../../models';
import { getAllReservations } from '../../services/apiService';
import { sortByDate } from '../../utils/utils';
import ReservationCard from './ReservationCard';
import ReservationPlaceholder from './ReservationPlaceholder';

function Reservations() {
  const navigate = useNavigate();
  const [upcomingReservations, setUpcomingReservations] = useState<
    Reservation[]
  >([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, login } = useLogin();

  useEffect(() => {
    if (isLoggedIn) {
      fetchReservations();
    } else {
      login();
    }
  }, [isLoggedIn]);

  function animateInReservations(reservations: Reservation[]) {
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
  }

  function fetchReservations() {
    getAllReservations()
      .then((reservations) => {
        setShowError(false);
        setLoading(true);
        animateInReservations(reservations);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          'Error retrieving reservations. Please try again later.'
        );
        setShowError(true);
        setLoading(false);
      });
  }

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
