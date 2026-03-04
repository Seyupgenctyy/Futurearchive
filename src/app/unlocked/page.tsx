'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PredictionCard from '@/components/PredictionCard'

export default function Unlocked() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)

    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('target_date', today)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPredictions(data)
      })
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>

        <h1 className="text-3xl font-bold mb-2">🔓 {lang === 'EN' ? 'Unlocked Today' : 'Bugün Açılanlar'}</h1>
        <p className="text-gray-400 mb-8">
          {lang === 'EN' ? 'Predictions that have reached their target date today.' : 'Bugün hedef tarihine ulaşan tahminler.'}
        </p>

        <div className="flex flex-col gap-4">
          {predictions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-gray-500">{lang === 'EN' ? 'No predictions unlocking today.' : 'Bugün açılan tahmin yok.'}</p>
              <p className="text-gray-600 text-sm mt-2">{lang === 'EN' ? 'Check back tomorrow!' : 'Yarın tekrar kontrol et!'}</p>
            </div>
          ) : (
            predictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} showVotes={true} />
            ))
          )}
        </div>
      </div>
    </main>
  )
}