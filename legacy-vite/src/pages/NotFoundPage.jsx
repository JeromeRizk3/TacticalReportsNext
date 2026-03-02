import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="center">
      <div className="card">
        <h1 className="h1">404</h1>
        <p className="muted">That page doesn’t exist.</p>
        <Link className="btn btn--primary" to="/">
          Go home
        </Link>
      </div>
    </div>
  )
}

