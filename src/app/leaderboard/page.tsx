'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Leaderboard() {
  const [prophets, setProphets] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('username, prophet_score')
      .order('prophet_score', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setProphets(data)
      })
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        <h1 className="text-3xl font-bold mb-2">Top Prophets</h1>
        <p className="text-gray-400 mb-8">The most accurate predictors in the archive.</p>

        <div className="flex flex-col gap-3">
          {prophets.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No prophets yet. Make a prediction!</p>
          ) : (
            prophets.map((p, i) => (
              <div key={p.username} className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 bg-white/5 hover:border-white/20 transition">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{medals[i] || `#${i + 1}`}</span>
                  <span className="font-medium">@{p.username}</span>
                </div>
                <span className="text-yellow-400 font-bold">⚡ {p.prophet_score} pts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}