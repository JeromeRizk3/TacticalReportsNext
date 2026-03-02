import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './state/auth.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppShell } from './components/AppShell.jsx'
import { NewsletterPage } from './pages/NewsletterPage.jsx'
import { PostDetailsPage } from './pages/PostDetailsPage.jsx'
import { SignInPage } from './pages/SignInPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? '/newsletter' : '/signin'} replace />}
      />
      <Route path="/signin" element={<SignInPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/posts/:postId" element={<PostDetailsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
