//./src/components/AddDogWithImage.tsx
'use client'

import { useState } from 'react'
import { db, storage, auth } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Preview = { file: File; url: string }

export default function AddDogWithImage() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('') // Edad del perro
  const [description, setDescription] = useState('') // Descripción
  const [location, setLocation] = useState('') // Ubicación
  //const [file, setFile] = useState<File | null>(null)
  const [previews, setPreviews] = useState<Preview[]>([])
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const selected = Array.from(files).slice(0, 4 - previews.length)
    const newPreviews = selected.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
    e.target.value = ''
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !age || !description || !location || previews.length === 0) {
      alert('Completá todos los campos y subí al menos una imagen.')
      return
    }

    // Subir imagen a Firebase Storage

    const imageUrls: string[] = []
    for (const { file } of previews) {
      const id = `${Date.now()}-${file.name}`
      const storageRef = ref(storage, `dogs/${id}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      imageUrls.push(url)
    }

    // Guardar en Firestore
    await addDoc(collection(db, 'dogs'), {
      name,
      age,
      description,
      location,
      imageUrls,
      createdAt: serverTimestamp(),
      owner: auth.currentUser?.uid,
      ownerEmail: auth.currentUser?.email,
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
        multiple
        onChange={handleFileChange}
        disabled={previews.length >= 4}
        className='border p-2 rounded'
      />

      {/* vista previa */}
      {previews.length > 0 && (
        <div className='grid grid-cols-2 gap-2'>
          {previews.map((p, i) => (
            <div key={i} className='relative'>
              <Image
                src={p.url}
                alt={`Imagen ${i + 1}`}
                width={160}
                height={128}
                className='w-full h-32 object-cover rounded'
              />
              <button
                type='button'
                onClick={() => removePreview(i)}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm'
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type='submit'
        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
      >
        Publicar mascota
      </button>
    </form>
  )
}
