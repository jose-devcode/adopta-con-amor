'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
}

export default function DogImagesViewer({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openModal = (index: number) => setSelectedIndex(index)
  const closeModal = () => setSelectedIndex(null)
  const prev = () =>
    setSelectedIndex((prevIndex) =>
      prevIndex !== null
        ? (prevIndex - 1 + images.length) % images.length
        : null
    )
  const next = () =>
    setSelectedIndex((prevIndex) =>
      prevIndex !== null ? (prevIndex + 1) % images.length : null
    )

  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        {images.map((url, idx) => (
          <div
            key={idx}
            className='relative cursor-pointer border rounded overflow-hidden'
            onClick={() => openModal(idx)}
          >
            <Image
              src={url}
              alt={`Foto ${idx + 1}`}
              width={300}
              height={200}
              className='object-cover w-full h-48'
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center'>
          <button
            onClick={closeModal}
            className='absolute top-4 right-4 text-white'
          >
            <X size={32} />
          </button>

          <button onClick={prev} className='absolute left-4 text-white'>
            <ChevronLeft size={48} />
          </button>

          <Image
            src={images[selectedIndex]}
            alt={`Foto grande ${selectedIndex + 1}`}
            width={800}
            height={600}
            className='rounded max-h-[80vh] w-auto'
          />

          <button onClick={next} className='absolute right-4 text-white'>
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  )
}
