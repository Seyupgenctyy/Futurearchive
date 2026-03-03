'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PredictionCard from '@/components/PredictionCard'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [rank, setRank] = useState<number>(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [profileCopied, setProfileCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileData) setProfile(profileData)

      const { data: predictionsData } = await supabase
        .from('predictions')
        .select('*, profiles(username)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })

      if (predictionsData) setPredictions(predictionsData)

      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, prophet_score')
        .order('prophet_score', { ascending: false })

      if (allProfiles) {
        const userRank = allProfiles.findIndex(p => p.id === data.user.id) + 1
        setRank(userRank)
      }
    })
  }, [])

  const totalPredictions = predictions.length
  const correctPredictions = predictions.filter(p => p.status === 'correct').length
  const wrongPredictions = predictions.filter(p => p.status === 'wrong').length
  const sealedPredictions = predictions.filter(p => p.is_sealed).length
  const accuracy = totalPredictions > 0
    ? Math.round((correctPredictions / (correctPredictions + wrongPredictions || 1)) * 100)
    : 0

  const getBadges = () => {
    const badges = []
    if (correctPredictions >= 1) badges.push({ icon: '🎯', name: 'Bold Predictor' })
    if (sealedPredictions >= 1) badges.push({ icon: '🤫', name: 'Silent Prophet' })
    if (predictions.some(p => {
      const years = new Date(p.target_date).getFullYear() - new Date(p.created_at).getFullYear()
      return years >= 5
    })) badges.push({ icon: '⏳', name: '5 Years Ahead' })
    if (correctPredictions >= 3) badges.push({ icon: '🔮', name: 'Early Visionary' })
    return badges
  }

  const handleShareProfile = () => {
    const text = `Check out my FutureArchive profile!\n@${profile?.username}\nProphet Score: ${profile?.prophet_score}\nAccuracy: ${accuracy}%\nGlobal Rank: #${rank}\n\n👉 futurearchive.vercel.app`
    if (navigator.share) {
      navigator.share({ title: 'My FutureArchive Profile', text, url: 'https://futurearchive.vercel.app' })
    } else {
      navigator.clipboard.writeText(text)
      setProfileCopied(true)
      setTimeout(() => setProfileCopied(false), 2000)
    }
  }

  const handleSharePrediction = (p: any) => {
    const text = `🎯 I predicted this on FutureArchive!\n\n"${p.text}"\n\nCategory: ${p.category}\nTarget Date: ${p.target_date}\nProphet Score: ${profile?.prophet_score} pts\n\n👉 futurearchive.vercel.app`
    if (navigator.share) {
      navigator.share({ title: 'I predicted this on FutureArchive!', text, url: 'https://futurearchive.vercel.app' })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(p.id)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const badges = getBadges()

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        {/* Profil Kartı */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/5 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">@{profile?.username || '...'}</h1>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleShareProfile}
              className="text-xs border border-white/10 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:border-white/30 transition"
            >
              {profileCopied ? '✅ Copied!' : '🔗 Share Profile'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center border border-white/10 rounded-xl p-4 bg-white/5">
              <div className="text-3xl font-bold text-yellow-400">⚡ {profile?.prophet_score || 0}</div>
              <div className="text-gray-500 text-xs mt-1">Prophet Score</div>
            </div>
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

        {/* Rozetler */}
        {badges.length > 0 && (
          <div className="border border-white/10 rounded-xl p-5 bg-white/5 mb-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">Badges</h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                  <span>{badge.icon}</span>
                  <span className="text-xs text-gray-300">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tahminler */}
        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          My Predictions
          {sealedPredictions > 0 && (
            <span className="text-xs text-gray-500 ml-3">({sealedPredictions} sealed 🔒)</span>
          )}
        </h2>
        <div className="flex flex-col gap-4">
          {predictions.filter(p => p.status !== 'pending_payment').length === 0 ? (
            <p className="text-gray-500 text-center py-10">No predictions yet.</p>
          ) : (
            predictions
              .filter(p => p.status !== 'pending_payment')
              .map((p) => (
                <div key={p.id}>
                  <PredictionCard prediction={p} showVotes={false} />
                  {p.status === 'correct' && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleSharePrediction(p)}
                        className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-lg hover:bg-green-500/30 transition"
                      >
                        {copied === p.id ? '✅ Copied!' : '🔗 Share this prediction'}
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  )
}