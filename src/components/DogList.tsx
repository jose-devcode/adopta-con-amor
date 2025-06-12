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
  imageUrl?: string
}

export default function DogList() {
  const [dogs, setDogs] = useState<Dog[]>([])

  useEffect(() => {
    const q = query(
      collection(db, 'dogs'),
      orderBy('createdAt', 'desc') // ordenar por más reciente :contentReference[oaicite:2]{index=2}
    )
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
            imageUrl: data.imageUrl,
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
          {d.imageUrl ? (
            <Image
              src={d.imageUrl}
              alt={d.name}
              width={64}
              height={64}
              className='rounded object-cover'
            />
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
