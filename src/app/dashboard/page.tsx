'use client'
import { useRequireAuth } from '../../lib/useAuth'
import Dashboard from '../../components/Dashboard'

export default function DashboardPage() {
  const { user, loading } = useRequireAuth()

  if (loading) return <p>Cargando...</p>
  if (!user) return null
  if (!user && !loading) {
    return <p>No autorizado</p>
  }

  return (
    <main>
      <Dashboard user={user} />
    </main>
  )
}
