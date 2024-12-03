import { Card } from 'react-bootstrap';
import { Reservation } from '../../models';
import { formatDate, formatTimeFromMinutes } from '../../utils/utils';

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

export default ReservationCard;
