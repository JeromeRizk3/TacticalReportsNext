import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth.jsx'

export function SignInPage() {
  const navigate = useNavigate()
  const { signIn, demoAccount, user } = useAuth()

  const [email, setEmail] = useState(demoAccount.email)
  const [password, setPassword] = useState(demoAccount.password)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return String(email).trim().length > 3 && String(password).length > 0
  }, [email, password])

  useEffect(() => {
    if (user) navigate('/newsletter', { replace: true })
  }, [navigate, user])

  return (
    <div className="center">
      <div className="card">
        <div className="card__header">
          <h1 className="h1">Sign in</h1>
          <p className="muted">
            Use the single demo account to enter the newsletter app.
          </p>
        </div>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!canSubmit) return
            setStatus('loading')
            setError('')
            try {
              await signIn({ email, password })
              navigate('/newsletter', { replace: true })
            } catch (err) {
              setStatus('error')
              setError(err?.message || 'Sign-in failed.')
            } finally {
              setStatus('idle')
            }
          }}
        >
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@newsletter.app"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn btn--primary" disabled={!canSubmit}>
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="hint">
            Demo credentials: <code>{demoAccount.email}</code> /{' '}
            <code>{demoAccount.password}</code>
          </div>
        </form>
      </div>
    </div>
  )
}

