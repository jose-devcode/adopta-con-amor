'use client'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useRouter } from 'next/navigation'

interface Props {
  dogId: string
  dogName: string
  dogOwnerEmail: string
}

export default function ContactForm({ dogId, dogName, dogOwnerEmail }: Props) {
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)

    try {
      await addDoc(collection(db, 'contacts'), {
        to: [dogOwnerEmail],
        message: {
          subject: `Interés en adoptar a ${dogName}`,
          text: message,
        },
        dogId,
        senderEmail: auth.currentUser?.email,
        createdAt: serverTimestamp(),
      })

      setSuccess(true)
      setMessage('')
      router.push('/mensaje-enviado')
    } catch (err) {
      console.error('Error al enviar mensaje:', err)
      alert('Hubo un error al enviar el mensaje.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 mt-8'>
      <h2 className='text-xl font-semibold'>¿Querés adoptar a {dogName}?</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Escribí tu mensaje para el dueño...'
        className='w-full p-2 border rounded'
        rows={5}
      />
      <button
        type='submit'
        className='bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
      {success && (
        <p className='text-green-600 font-medium'>
          ¡Tu mensaje fue enviado con éxito!
        </p>
      )}
    </form>
  )
}
