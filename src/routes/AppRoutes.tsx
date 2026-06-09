import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'
import HomePage from '../pages/home-page/HomePage'
import LoginPage from '../pages/login-page/LoginPage'
import RegisterPage from '../pages/register-page/RegisterPage'
import RegisterPassengerPage from '../pages/register-page/RegisterPassengerPage'
import RegisterOperatorPage from '../pages/register-page/RegisterOperatorPage'
import TripsPage from '../pages/TripsPage'
import BookingPage from '../pages/BookingPage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'
import SubscriptionPage from '../pages/SubscriptionPage'


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
      {
        path: 'subscription',
        element: <SubscriptionPage />
      }
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])