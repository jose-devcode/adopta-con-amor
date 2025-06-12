'use client'
import dynamic from 'next/dynamic'

const DogList = dynamic(() => import('./DogList'), {
  ssr: false,
})

export default function DogListClient() {
  return <DogList />
}
