'use client'

import Image from 'next/image'

interface ImageModalProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[90%] max-h-[90%] w-auto h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 z-60 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          ✕
        </button>
        <Image 
          src={src} 
          alt={alt} 
          layout="responsive"
          width={800}
          height={800}
          className="rounded-lg object-contain max-w-full max-h-full"
        />
      </div>
    </div>
  )
}
