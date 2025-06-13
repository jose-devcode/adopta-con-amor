// src/app/perro/[id]/page.tsx
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import ContactForm from '../../../components/ContactForm'
import DogImagesViewer from '../../../components/DogCarousel'

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'dogs'))
  return snapshot.docs.map((d) => ({ id: d.id }))
}

export default async function DogPage({ params }: { params: { id: string } }) {
  const { id } = params
  const docRef = doc(db, 'dogs', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return <p>Perro no encontrado.</p>

  const data = docSnap.data() as {
    name: string
    age: string
    description: string
    location: string
    imageUrls?: string[]
    ownerEmail: string
  }

  return (
    <main className='p-6 max-w-2xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold'>{data.name}</h1>

      <DogImagesViewer images={data.imageUrls || []} />

      <ContactForm
        dogId={id}
        dogName={data.name}
        dogOwnerEmail={data.ownerEmail}
      />
    </main>
  )
}
