'use client'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import Image from 'next/image'

interface Dog {
  id: string
  name: string
  imageUrl?: string
}

interface Props {
  user: { uid: string }
}

export default function Dashboard({ user }: Props) {
  const [dogs, setDogs] = useState<Dog[]>([])

  useEffect(() => {
    const q = query(collection(db, 'dogs'), where('owner', '==', user.uid))
    return onSnapshot(q, (snap) => {
      setDogs(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          imageUrl: d.data().imageUrl,
        }))
      )
    })
  }, [user.uid])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta publicación?')) return
    await deleteDoc(doc(db, 'dogs', id))
  }

  if (!user) return <p>Cargando...</p>

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Mis Mascotas Publicadas</h2>
      {dogs.length === 0 ? (
        <p>No has publicado mascotas aún.</p>
      ) : (
        <ul className='space-y-4'>
          {dogs.map((d) => (
            <li key={d.id} className='flex items-center space-x-4'>
              {d.imageUrl && (
                <Image
                  src={d.imageUrl}
                  alt={d.name}
                  width={64}
                  height={64}
                  className='rounded object-cover'
                />
              )}
              <span className='flex-1'>{d.name}</span>
              <button
                onClick={() => handleDelete(d.id)}
                className='bg-red-500 text-white px-3 py-1 rounded'
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
