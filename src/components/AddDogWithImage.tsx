'use client'

import { useState } from 'react'
import { db, storage, auth } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'

export default function AddDogWithImage() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('') // Edad del perro
  const [description, setDescription] = useState('') // Descripción
  const [location, setLocation] = useState('') // Ubicación
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !age || !description || !location || !file) {
      alert('Por favor completá todos los campos.')
      return
    }

    // Subir imagen a Firebase Storage
    const id = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `dogs/${id}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)

    // Guardar en Firestore
    await addDoc(collection(db, 'dogs'), {
      name,
      age,
      description,
      location,
      imageUrl: url,
      createdAt: serverTimestamp(),
      owner: auth.currentUser?.uid,
      ownerEmail: auth.currentUser?.email, // <-- Agregado
    })

    alert('¡Perro agregado con éxito!')
    router.push('/')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-4 flex flex-col gap-4 max-w-lg mx-auto'
    >
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Nombre del perrito'
        className='border p-2 rounded'
      />

      <input
        type='text'
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder='Edad (ej. 3 años)'
        className='border p-2 rounded'
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Descripción'
        className='border p-2 rounded'
        rows={3}
      />

      <input
        type='text'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder='Ubicación (ciudad, país)'
        className='border p-2 rounded'
      />

      <input
        type='file'
        accept='image/*'
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className='border p-2 rounded'
      />

      <button
        type='submit'
        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
      >
        Publicar mascota
      </button>
    </form>
  )
}
