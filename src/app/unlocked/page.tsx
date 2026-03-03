'use client'
import PredictionCard from '@/components/PredictionCard'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Unlocked() {
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
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
          ← Back to FutureArchive
        </Link>

        <h1 className="text-3xl font-bold mb-2">🔓 Unlocked Today</h1>
        <p className="text-gray-400 mb-8">Predictions that have reached their target date today.</p>

        <div className="flex flex-col gap-4">
          {predictions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-gray-500">No predictions unlocking today.</p>
              <p className="text-gray-600 text-sm mt-2">Check back tomorrow!</p>
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