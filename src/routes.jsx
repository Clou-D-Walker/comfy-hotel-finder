
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import ModeratorLogin from './pages/ModeratorLogin';
import WorkerLogin from './pages/WorkerLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import Hotels from './pages/Hotels';
import HotelRooms from './pages/HotelRooms';
import About from './pages/About';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <UserDashboard />,
  },
  {
    path: '/hotels',
    element: <Hotels />,
  },
  {
    path: '/hotels/:id',
    element: <HotelRooms />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  // Special login routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/moderator/login',
    element: <ModeratorLogin />,
  },
  {
    path: '/worker/login',
    element: <WorkerLogin />,
  },
  // Dashboard routes
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/moderator',
    element: <ModeratorDashboard />,
  },
  {
    path: '/worker',
    element: <WorkerDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

export default router;
