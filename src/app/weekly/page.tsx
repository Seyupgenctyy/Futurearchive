'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PredictionCard from '@/components/PredictionCard'

export default function Weekly() {
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('category', 'Crazy Predictions')
      .eq('status', 'active')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('votes_correct', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setPredictions(data)
      })
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌀</span>
          <h1 className="text-3xl font-bold">Weekly Top 10</h1>
        </div>
        <p className="text-gray-400 mb-2">The craziest predictions of the week.</p>
        <p className="text-gray-600 text-xs mb-8">Updated every week · Ranked by community votes</p>

        <div className="flex flex-col gap-4">
          {predictions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌀</div>
              <p className="text-gray-500">No crazy predictions this week yet.</p>
              <Link href="/predict" className="mt-4 inline-block text-white border border-white/20 px-6 py-2 rounded-lg hover:bg-white/5 transition text-sm">
                Make a Crazy Prediction
              </Link>
            </div>
          ) : (
            predictions.map((p, i) => (
              <div key={p.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white/20">#{i + 1}</span>
                </div>
                <PredictionCard prediction={p} showVotes={true} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}