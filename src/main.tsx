import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import About from './About.tsx';
import App from './App.tsx';
import Home from './Home.tsx';
import NewReservation from './NewReservation.tsx';
import { default as Login, default as Reservations } from './Reservations.tsx';
import Services from './Services.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="services" element={<Services />} />
      <Route path="reservations" element={<Reservations />} />
      <Route path="request-reservation" element={<NewReservation />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
