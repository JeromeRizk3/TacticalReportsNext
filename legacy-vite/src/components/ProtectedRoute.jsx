import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/auth.jsx'

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}

