import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import About from './components/Home/About.tsx';
import Home from './components/Home/Home.tsx';
import Services from './components/Home/Services.tsx';
import Redirect from './components/Redirect.tsx';
import NewReservation from './components/Reservation/NewReservation.tsx';
import Reservations from './components/Reservation/Reservations.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="reservations" element={<Reservations />} />
      <Route path="request-reservation" element={<NewReservation />} />
      <Route path="redirect" element={<Redirect />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
