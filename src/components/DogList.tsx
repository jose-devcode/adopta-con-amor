// src/components/DogList.tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import Image from 'next/image'

interface Dog {
  id: string
  name: string
  age: string
  description: string
  location: string
  imageUrls?: string[] // <-- ahora es un array
}

export default function DogList() {
  const [dogs, setDogs] = useState<Dog[]>([])

  useEffect(() => {
    const q = query(collection(db, 'dogs'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      setDogs(
        snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            age: data.age,
            description: data.description ?? '',
            location: data.location,
            imageUrls: data.imageUrls ?? [], // ← fallback en array vacío
          }
        })
      )
    })
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4'>
      {dogs.map((d) => (
        <Link
          key={d.id}
          href={`/perro/${d.id}`}
          className='block border rounded overflow-hidden hover:shadow-lg transition'
        >
          {d.imageUrls && d.imageUrls.length > 0 ? (
            <div className='relative w-full h-48'>
              <Image
                src={d.imageUrls[0]} // ← solo mostramos la primera imagen
                alt={d.name}
                fill
                className='object-cover'
                sizes='(max-width: 640px) 100vw, 33vw'
                priority
              />
            </div>
          ) : (
            <div className='w-full h-48 bg-gray-200 flex items-center justify-center'>
              <span className='text-gray-500'>Sin imagen</span>
            </div>
          )}
          <div className='p-3'>
            <h2 className='text-lg font-semibold'>{d.name}</h2>
            <p className='text-sm text-gray-600'>
              {d.age} · {d.location}
            </p>
            <p className='mt-2 text-sm'>
              {d.description
                ? d.description.slice(0, 60) +
                  (d.description.length > 60 ? '...' : '')
                : 'Sin descripción'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
