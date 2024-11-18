import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export function Notifications() {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ position: 'sticky', bottom: 0, zIndex: 999 }}
    >
      <ToastContainer position="bottom-center" className="p-3 text-white">
        <Toast bg="success" autohide>
          <Toast.Body>See? Just like this.</Toast.Body>
        </Toast>
        <Toast bg="dark" autohide>
          <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
