import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { router } from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<<<<<<< HEAD
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
=======
    <RouterProvider router={router} />
    <Toaster position="bottom-right" reverseOrder={false} />
>>>>>>> cb94e3795164dbe8a556bc40106880fc220f368c
  </StrictMode>,
)