import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'

const HomePage = lazy(() => import('../pages/home-page/HomePage'))
const LoginPage = lazy(() => import('../pages/login-page/LoginPage'))
const RegisterPage = lazy(() => import('../pages/register-page/RegisterPage'))
const RegisterPassengerPage = lazy(() => import('../pages/register-page/RegisterPassengerPage'))
const RegisterOperatorPage = lazy(() => import('../pages/register-page/register-operator-page/RegisterOperatorPage'))
const TripsPage = lazy(() => import('../pages/TripsPage'))
const BookingPage = lazy(() => import('../pages/BookingPage'))
const PaymentPage = lazy(() => import('../pages/PaymentPage'))
const TicketPage = lazy(() => import('../pages/TicketPage'))
const MyBookingsPage = lazy(() => import('../pages/MyBookingsPage'))
const BookingDetailPage = lazy(() => import('../pages/BookingDetailPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const SubscriptionPage = lazy(() => import('../pages/subscription-page/SubscriptionPage'))
const BlogPage = lazy(() => import('../pages/blog-page/BlogPage'))
const BlogDetailPage = lazy(() => import('../pages/blog-page/blog-detail-page/BlogDetailPage'))
const OperatorListPage = lazy(() => import('../pages/operator-page/OperatorListPage'))
const OperatorDetailPage = lazy(() => import('../pages/operator-page/OperatorDetailPage'))
const VerifyEmailPage = lazy(() => import('../pages/verify-page/VerifyEmailPage'))

// New Features Routes
const MyFavouritesPage = lazy(() => import('../pages/MyFavouritesPage'))
const MyReportsPage = lazy(() => import('../pages/MyReportsPage'))
const MyFeedbacksPage = lazy(() => import('../pages/MyFeedbacksPage'))
const LookupPage = lazy(() => import('../pages/LookupPage'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
    {children}
  </Suspense>
)


export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: 'login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: 'verify-email',
        element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper>,
      },
      {
        path: 'register',
        children: [
          {
            index: true,
            element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
          },
          {
            path: 'passenger',
            element: <SuspenseWrapper><RegisterPassengerPage /></SuspenseWrapper>,
          },
          {
            path: 'operator',
            element: <SuspenseWrapper><RegisterOperatorPage /></SuspenseWrapper>,
          },
        ],
      },
      {
        path: 'trips',
        element: <SuspenseWrapper><TripsPage /></SuspenseWrapper>,
      },
      {
        path: 'booking',
        element: <SuspenseWrapper><BookingPage /></SuspenseWrapper>,
      },
      {
        path: 'payment/:bookingCode',
        element: <SuspenseWrapper><PaymentPage /></SuspenseWrapper>,
      },
      {
        path: 'tickets/:bookingCode',
        element: <SuspenseWrapper><TicketPage /></SuspenseWrapper>,
      },
      {
        path: 'my-bookings',
        element: <SuspenseWrapper><MyBookingsPage /></SuspenseWrapper>,
      },
      {
        path: 'my-bookings/:bookingCode',
        element: <SuspenseWrapper><BookingDetailPage /></SuspenseWrapper>,
      },
      {
        path: 'profile',
        element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
      },
      {
        path: 'my-favourites',
        element: <SuspenseWrapper><MyFavouritesPage /></SuspenseWrapper>,
      },
      {
        path: 'my-reports',
        element: <SuspenseWrapper><MyReportsPage /></SuspenseWrapper>,
      },
      {
        path: 'my-feedbacks',
        element: <SuspenseWrapper><MyFeedbacksPage /></SuspenseWrapper>,
      },
      {
        path: 'subscription',
        element: <SuspenseWrapper><SubscriptionPage /></SuspenseWrapper>
      },
      {
        path: 'operators',
        element: <SuspenseWrapper><OperatorListPage /></SuspenseWrapper>
      },
      {
        path: 'operators/:id',
        element: <SuspenseWrapper><OperatorDetailPage /></SuspenseWrapper>
      },
      {
        path: 'blog',
        element: <SuspenseWrapper><BlogPage /></SuspenseWrapper>
      },
      {
        path: 'blog/:id',
        element: <SuspenseWrapper><BlogDetailPage /></SuspenseWrapper>
      },
      {
        path: 'lookup',
        element: <SuspenseWrapper><LookupPage /></SuspenseWrapper>
      }
    ],
  },
  {
    path: '*',
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
])