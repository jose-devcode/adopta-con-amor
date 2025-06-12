'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { auth } from '../lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function NavBar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [user, loading] = useAuthState(auth)

  if (!mounted) return null

  return (
    <nav className='p-4 bg-gray-800 flex items-center'>
      <Link href='/' className='mr-4 font-bold'>
        Inicio
      </Link>
      {loading ? (
        <span>...</span>
      ) : user ? (
        <>
          <Link href='/publicar' className='mr-4'>
            Publicar
          </Link>
          <Link href='/dashboard' className='mr-4'>
            Dashboard
          </Link>
          <button
            onClick={() => auth.signOut()}
            className='ml-auto bg-red-500 text-white px-3 py-1 rounded'
          >
            Salir
          </button>
        </>
      ) : (
        <Link
          href='/login'
          className='ml-auto bg-blue-500 text-white px-3 py-1 rounded'
        >
          Iniciar sesión
        </Link>
      )}
    </nav>
  )
}
