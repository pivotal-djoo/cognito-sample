import { useState } from 'react';
import { Button, Card, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Hydration from '../../assets/hydration.webp';
import { formatDate, formatTimeFromMinutes } from '../../utils/utils';

type Reservation = {
  service: string;
  date: string;
  durationInMinutes: number;
  location: string;
  past: boolean;
  status: string;
};

function ReservationCard({
  reservation,
  showStatus = false,
}: {
  reservation: Reservation;
  showStatus?: boolean;
}) {
  return (
    <Card className="my-3">
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
  const [reservations, _setReservations] = useState<Reservation[]>([
    {
      service: 'Cryotherapy - Chamber',
      date: '2025-02-21T18:00-0500',
      durationInMinutes: 40,
      location: 'Queen West Store',
      past: false,
      status: 'Confirmed',
    },
  ]);
  const [pastReservations, _setPastReservations] = useState<Reservation[]>([
    {
      service: 'Deep Tissue Massage Therapy',
      date: '2024-10-21T14:00-0400',
      durationInMinutes: 80,
      location: 'Queen West Store',
      past: true,
      status: 'Completed',
    },
    {
      service: 'Post Event Massage Therapy',
      date: '2024-10-19T20:00-0400',
      durationInMinutes: 135,
      location: 'Queen West Store',
      past: true,
      status: 'Completed',
    },
  ]);
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
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <ReservationCard
                key={reservation.date}
                reservation={reservation}
                showStatus={true}
              />
            ))
          ) : (
            <p className="mb-5">You have no upcoming reservations</p>
          )}

          <p className="fs-5 my-3">Past reservations</p>
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationCard
                reservation={reservation}
                key={reservation.date}
              />
            ))
          ) : (
            <p className="mb-5">You have no past reservations</p>
          )}
        </div>
      </Container>
    </>
  );
}

export default Reservations;
