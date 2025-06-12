import DogListClient from '../components/DogListClient'

export const metadata = {
  title: 'Adoptá con Amor',
  description: 'Explorá perritos en adopción y encontrá un nuevo compañero.',
}

export default function HomePage() {
  return (
    <main className='p-4'>
      <header className='max-w-3xl mx-auto mb-6'>
        <h1 className='text-4xl font-bold text-center'>Adoptá con Amor 🐾</h1>
        <p className='mt-2 text-center text-lg text-gray-700'>
          Descubrí y contactá a tus próximos compañeros de vida.
        </p>
      </header>
      <section className='max-w-5xl mx-auto'>
        <DogListClient />
      </section>
    </main>
  )
}
