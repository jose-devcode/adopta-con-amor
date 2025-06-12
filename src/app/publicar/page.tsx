// src/app/publicar/page.tsx
'use client'
import { useRequireAuth } from '../../lib/useAuth'
import AddDogWithImage from '../../components/AddDogWithImage'

export default function PublicarPage() {
  const { user, loading } = useRequireAuth()

  if (loading) return <p>Cargando...</p>
  if (!user) return null

  return (
    <main className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Publicar mascota en adopción</h1>
      <AddDogWithImage />
    </main>
  )
}
