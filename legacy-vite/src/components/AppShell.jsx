import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../state/auth.jsx'
import { useEntitlements } from '../state/entitlements.jsx'
import { BuyCreditsDialog } from './BuyCreditsDialog.jsx'

export function AppShell() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { creditsBalance, addCredits } = useEntitlements()
  const [buyOpen, setBuyOpen] = useState(false)

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand" role="banner">
            <div className="brand__logo" aria-hidden="true">
              TC
            </div>
            <div className="brand__text">
              <div className="brand__name">Tactical Reports</div>
              <div className="brand__meta">
                Signed in as <strong>{user?.email}</strong>
                {' '}
                · Credits: <strong>{creditsBalance}</strong>
              </div>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/newsletter" className="nav__link">
              Feed
            </NavLink>
            <button className="btn btn--ghost" onClick={() => setBuyOpen(true)}>
              Buy credits
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                signOut()
                navigate('/signin', { replace: true })
              }}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <BuyCreditsDialog
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onBuy={(credits) => addCredits(credits)}
      />
    </div>
  )
}

