'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Leaderboard() {
  const [prophets, setProphets] = useState<any[]>([])
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)

    supabase
      .from('predictions')
      .select('user_id, profiles(username)')
      .eq('status', 'correct')
      .then(({ data }) => {
        if (!data) return

        const countMap: Record<string, { username: string; correct: number }> = {}
        data.forEach((p: any) => {
          if (!p.profiles) return
          const key = p.user_id
          if (!countMap[key]) {
            countMap[key] = { username: p.profiles.username, correct: 0 }
          }
          countMap[key].correct += 1
        })

        const sorted = Object.values(countMap)
          .sort((a, b) => b.correct - a.correct)
          .slice(0, 20)

        setProphets(sorted)
      })
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          {lang === 'EN' ? 'Top Prophets' : 'En İyi Vizyonerler'}
        </h1>
        <p className="text-gray-400 mb-8">
          {lang === 'EN' ? 'Ranked by correct predictions.' : 'Doğru tahmin sayısına göre sıralanmıştır.'}
        </p>

        <div className="flex flex-col gap-3">
          {prophets.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              {lang === 'EN' ? 'No verified predictions yet.' : 'Henüz doğrulanmış tahmin yok.'}
            </p>
          ) : (
            prophets.map((p, i) => (
              <div key={p.username} className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 bg-white/5 hover:border-white/20 transition">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{medals[i] || `#${i + 1}`}</span>
                  <span className="font-medium">@{p.username}</span>
                </div>
                <span className="text-green-400 font-bold">✅ {p.correct} {lang === 'EN' ? 'correct' : 'doğru'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}