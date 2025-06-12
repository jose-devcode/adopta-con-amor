'use client'
import { useEffect } from 'react'
import { auth } from '../lib/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const provider = new GoogleAuthProvider()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/dashboard')
    })
    return () => unsub()
  }, [router])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error(err)
      alert('Error al intentar iniciar sesión.')
    }
  }

  return (
    <div className='p-4'>
      <button
        onClick={signInWithGoogle}
        className='bg-blue-600 text-white px-4 py-2 rounded'
      >
        Iniciar sesión con Google
      </button>
    </div>
  )
}
