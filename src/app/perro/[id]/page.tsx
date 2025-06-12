// src/app/perro/[id]/page.tsx
import React from 'react'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import ContactForm from '../../../components/ContactForm'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'dogs'))
  return snapshot.docs.map((d) => ({ id: d.id }))
}

export default async function DogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const docRef = doc(db, 'dogs', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    notFound()
  }

  if (!docSnap.exists()) {
    return <p className='p-4'>Perro no encontrado.</p>
  }

  const data = docSnap.data() as {
    name: string
    age: string
    description: string
    location: string
    imageUrl?: string
    ownerEmail: string
  }

  const { name, age, description, location, imageUrl, ownerEmail } = data

  return (
    <main className='p-6 max-w-2xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold'>{name}</h1>

      {imageUrl && (
        <div className='relative w-64 h-64 mx-auto rounded-lg overflow-hidden'>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes='(max-width: 640px) 90vw, 256px'
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <strong>Edad:</strong> {age}
        </div>
        <div>
          <strong>Ubicación:</strong> {location}
        </div>
      </div>

      <div>
        <strong>Descripción:</strong>
        <p className='mt-2'>{description}</p>
      </div>

      <ContactForm dogId={id} dogName={name} dogOwnerEmail={ownerEmail} />
    </main>
  )
}
