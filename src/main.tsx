import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { router } from './routes/AppRoutes'
import Preloader from './components/Preloader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preloader />
    <RouterProvider router={router} />
    <Toaster position="bottom-right" reverseOrder={false} />
  </StrictMode>,
)