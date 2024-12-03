import { Card, Placeholder } from 'react-bootstrap';

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

export default ReservationPlaceholder;
