'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PredictionCard from '@/components/PredictionCard'

export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [rank, setRank] = useState<number>(0)
  const [notFound, setNotFound] = useState(false)
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)

    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profileData) { setNotFound(true); return }
    setProfile(profileData)

    const { data: predictionsData } = await supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('user_id', profileData.id)
      .neq('status', 'pending_payment')
      .order('created_at', { ascending: false })

    if (predictionsData) setPredictions(predictionsData)

    // Rank hesapla
    const { data: allPreds } = await supabase
      .from('predictions')
      .select('user_id')
      .eq('status', 'correct')

    if (allPreds) {
      const countMap: Record<string, number> = {}
      allPreds.forEach((p: any) => {
        countMap[p.user_id] = (countMap[p.user_id] || 0) + 1
      })
      const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1])
      const userRank = sorted.findIndex(([id]) => id === profileData.id) + 1
      setRank(userRank || sorted.length + 1)
    }
  }

  const correctPredictions = predictions.filter(p => p.status === 'correct').length
  const wrongPredictions = predictions.filter(p => p.status === 'wrong').length
  const totalPredictions = predictions.length
  const accuracy = (correctPredictions + wrongPredictions) > 0
    ? Math.round((correctPredictions / (correctPredictions + wrongPredictions)) * 100)
    : 0

  if (notFound) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">👤</div>
        <h1 className="text-2xl font-bold mb-2">Prophet not found</h1>
        <p className="text-gray-500 mb-6">@{username} does not exist in the archive.</p>
        <Link href="/" className="text-white border border-white/20 px-6 py-2 rounded-lg hover:bg-white/5 transition">
          Back to FutureArchive
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>

        {/* Profil Kartı */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/5 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">@{profile?.username}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {lang === 'EN' ? 'Member of FutureArchive' : 'FutureArchive Üyesi'}
              </p>
            </div>
            <div className="text-xs border border-white/10 px-3 py-2 rounded-lg text-gray-500">
              👁 {lang === 'EN' ? 'Public Profile' : 'Herkese Açık Profil'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center border border-white/10 rounded-xl p-4 bg-white/5">
              <div className="text-3xl font-bold">#{rank || '?'}</div>
              <div className="text-gray-500 text-xs mt-1">Global Rank</div>
            </div>
            <div className="text-center border border-white/10 rounded-xl p-4 bg-white/5">
              <div className="text-3xl font-bold">{accuracy}%</div>
              <div className="text-gray-500 text-xs mt-1">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center border border-white/10 rounded-xl p-3 bg-white/5">
              <div className="text-xl font-bold">{totalPredictions}</div>
              <div className="text-gray-500 text-xs mt-1">Total</div>
            </div>
            <div className="text-center border border-white/10 rounded-xl p-3 bg-white/5">
              <div className="text-xl font-bold text-green-400">{correctPredictions}</div>
              <div className="text-gray-500 text-xs mt-1">Correct</div>
            </div>
            <div className="text-center border border-white/10 rounded-xl p-3 bg-white/5">
              <div className="text-xl font-bold text-red-400">{wrongPredictions}</div>
              <div className="text-gray-500 text-xs mt-1">Wrong</div>
            </div>
          </div>
        </div>

        {/* Tahminler */}
        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          {lang === 'EN' ? 'Predictions' : 'Tahminler'}
        </h2>
        <div className="flex flex-col gap-4">
          {predictions.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              {lang === 'EN' ? 'No public predictions yet.' : 'Henüz herkese açık tahmin yok.'}
            </p>
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