'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PredictionCard from '@/components/PredictionCard'

const allCategories = [
  { name: 'Technology', icon: '💻' },
  { name: 'AI', icon: '🤖' },
  { name: 'Economy', icon: '📈' },
  { name: 'Politics', icon: '🏛️' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Crypto', icon: '₿' },
  { name: 'Turkey', icon: '🇹🇷' },
  { name: 'Global', icon: '🌍' },
  { name: 'Crazy Predictions', icon: '🌀' },
]

export default function Categories() {
  const [selected, setSelected] = useState('Technology')
  const [predictions, setPredictions] = useState<any[]>([])
  const [langFilter, setLangFilter] = useState<'ALL' | 'EN' | 'TR'>('ALL')
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    fetchPredictions()
  }, [selected, langFilter])

  const fetchPredictions = async () => {
    let query = supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('category', selected)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (langFilter !== 'ALL') {
      query = query.eq('language', langFilter)
    }

    const { data } = await query
    if (data) setPredictions(data)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>

        <h1 className="text-3xl font-bold mb-2">{lang === 'EN' ? 'Categories' : 'Kategoriler'}</h1>
        <p className="text-gray-400 mb-8">{lang === 'EN' ? 'Browse predictions by category.' : 'Tahminleri kategoriye göre gözat.'}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelected(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                selected === cat.name
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-8">
          {['ALL', 'EN', 'TR'].map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l as any)}
              className={`px-4 py-1.5 rounded-lg text-xs border transition ${
                langFilter === l
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {predictions.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              {lang === 'EN' ? 'No predictions in this category yet.' : 'Bu kategoride henüz tahmin yok.'}
            </p>
          ) : (
            predictions.map((p) => (
              <PredictionCard key={p.id} prediction={p} showVotes={false} />
            ))
          )}
        </div>
      </div>
    </main>
  )
}