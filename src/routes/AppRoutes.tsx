import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import RegisterPassengerPage from '../pages/RegisterPassengerPage'
import RegisterOperatorPage from '../pages/RegisterOperatorPage'
import TripsPage from '../pages/TripsPage'
import BookingPage from '../pages/BookingPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        children: [
          {
            index: true,
            element: <RegisterPage />,
          },
          {
            path: 'passenger',
            element: <RegisterPassengerPage />,
          },
          {
            path: 'operator',
            element: <RegisterOperatorPage />,
          },
        ],
      },
      {
        path: 'trips',
        element: <TripsPage />,
      },
      {
        path: 'booking',
        element: <BookingPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])