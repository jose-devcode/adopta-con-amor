'use client'
import { useState } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function AddDog() {
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'dogs'), {
        name,
        createdAt: serverTimestamp(),
      })
      alert('Perro agregado!')
      setName('')
    } catch (err) {
      console.error(err)
      alert('Error al agregar perro')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Nombre del perrito'
        className='border p-2 mr-2'
      />
      <button
        type='submit'
        className='bg-green-600 text-white px-4 py-2 rounded'
      >
        Agregar
      </button>
    </form>
  )
}
