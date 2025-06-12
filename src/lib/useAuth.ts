// src/lib/useAuth.ts
'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRequireAuth(redirectTo = '/login') {
  const [user, loading, error] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading, error }
}
