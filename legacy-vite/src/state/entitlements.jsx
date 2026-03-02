import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ENTITLEMENTS_STORAGE_KEY = 'xproj.entitlements.v1'

const EntitlementsContext = createContext(null)

function readState() {
  try {
    const raw = localStorage.getItem(ENTITLEMENTS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      creditsBalance: typeof parsed?.creditsBalance === 'number' ? parsed.creditsBalance : 0,
      unlockedPostIds: Array.isArray(parsed?.unlockedPostIds) ? parsed.unlockedPostIds : [],
    }
  } catch {
    return null
  }
}

export function EntitlementsProvider({ children }) {
  const restored = readState()
  const [creditsBalance, setCreditsBalance] = useState(() => restored?.creditsBalance ?? 0)
  const [unlockedPostIds, setUnlockedPostIds] = useState(
    () => restored?.unlockedPostIds ?? [],
  )

  useEffect(() => {
    localStorage.setItem(
      ENTITLEMENTS_STORAGE_KEY,
      JSON.stringify({ creditsBalance, unlockedPostIds }),
    )
  }, [creditsBalance, unlockedPostIds])

  const value = useMemo(() => {
    const unlockedSet = new Set(unlockedPostIds)

    return {
      creditsBalance,
      unlockedPostIds,
      isPostUnlocked(postId) {
        return unlockedSet.has(postId)
      },
      addCredits(amount) {
        const n = Number(amount)
        if (!Number.isFinite(n) || n <= 0) return
        setCreditsBalance((prev) => prev + n)
      },
      unlockPost({ postId, cost }) {
        const c = Number(cost)
        if (!postId) {
          const err = new Error('Missing post id.')
          err.code = 'MISSING_POST_ID'
          throw err
        }
        if (!Number.isFinite(c) || c < 0) {
          const err = new Error('Invalid cost.')
          err.code = 'INVALID_COST'
          throw err
        }
        if (unlockedSet.has(postId)) return { alreadyUnlocked: true }
        if (creditsBalance < c) {
          const err = new Error('Not enough credits.')
          err.code = 'INSUFFICIENT_CREDITS'
          throw err
        }
        setCreditsBalance((prev) => prev - c)
        setUnlockedPostIds((prev) => [...new Set([...prev, postId])])
        return { unlocked: true }
      },
      resetCreditsAndUnlocks() {
        setCreditsBalance(0)
        setUnlockedPostIds([])
      },
    }
  }, [creditsBalance, unlockedPostIds])

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  )
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext)
  if (!ctx)
    throw new Error('useEntitlements must be used within <EntitlementsProvider>.')
  return ctx
}

