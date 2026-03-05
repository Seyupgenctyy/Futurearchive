'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-white/10 mb-4">404</div>
        <div className="text-5xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold mb-2">
          {lang === 'EN' ? 'Page not found' : 'Sayfa bulunamadı'}
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          {lang === 'EN'
            ? 'This page does not exist in the archive. Maybe it was never predicted.'
            : 'Bu sayfa arşivde mevcut değil. Belki hiç tahmin edilmedi.'}
        </p>
        <Link
          href="/"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>
      </div>
    </main>
  )
}