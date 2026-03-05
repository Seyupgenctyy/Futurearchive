'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function PredictionDetail() {
  const { id } = useParams()
  const [prediction, setPrediction] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const [voted, setVoted] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`voted_${id}`) === 'true'
  }
  return false
  })
  const [votes, setVotes] = useState({ correct: 0, wrong: 0 })
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
    fetchPrediction()
  }, [id])

  const fetchPrediction = async () => {
    const { data } = await supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('id', id)
      .single()

    if (!data) { setNotFound(true); return }
    setPrediction(data)
    setVotes({ correct: data.votes_correct || 0, wrong: data.votes_wrong || 0 })
  }

  const handleVote = async (type: 'correct' | 'wrong') => {
    if (voted) return
    setVoted(true)
    localStorage.setItem(`voted_${id}`, 'true')
    const update = type === 'correct'
      ? { votes_correct: votes.correct + 1 }
      : { votes_wrong: votes.wrong + 1 }
    await supabase.from('predictions').update(update).eq('id', id)
    setVotes(prev => ({ ...prev, [type]: prev[type] + 1 }))
  }

  const handleShare = () => {
    const url = `${window.location.origin}/prediction/${id}`
    if (navigator.share) {
      navigator.share({ title: 'FutureArchive Prediction', text: prediction?.text, url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statusColors: Record<string, string> = {
    correct: 'bg-green-500/20 text-green-400 border-green-500/30',
    wrong: 'bg-red-500/20 text-red-400 border-red-500/30',
    active: 'bg-white/10 text-gray-400 border-white/10',
  }

  if (notFound) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Prediction not found</h1>
        <p className="text-gray-500 mb-6">This prediction does not exist in the archive.</p>
        <Link href="/" className="text-white border border-white/20 px-6 py-2 rounded-lg hover:bg-white/5 transition">
          Back to FutureArchive
        </Link>
      </div>
    </main>
  )

  if (!prediction) return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← {lang === 'EN' ? 'Back to FutureArchive' : 'FutureArchive\'e Dön'}
        </Link>

        {/* Ana Kart */}
        <div className="border border-white/10 rounded-xl p-6 bg-white/5 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Link href={`/profile/${prediction.profiles?.username}`} className="text-sm text-gray-400 hover:text-white transition">
              @{prediction.profiles?.username}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 border border-white/10 px-2 py-0.5 rounded-full">
                {prediction.language}
              </span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">
                {prediction.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[prediction.status] || statusColors.active}`}>
                {prediction.status}
              </span>
            </div>
          </div>

          {/* Tahmin Metni */}
          {prediction.is_sealed && prediction.status === 'active' ? (
            <div className="flex items-center gap-2 text-gray-500 italic text-lg mb-4">
              <span>🔒</span>
              <span>{lang === 'EN' ? 'Sealed until' : 'Kilitli:'} {prediction.target_date}</span>
            </div>
          ) : (
            <p className="text-white text-xl leading-relaxed mb-4">{prediction.text}</p>
          )}

          {/* Tarih */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <span>🗓</span>
            <span>{lang === 'EN' ? 'Unlocks:' : 'Açılış:'} {prediction.target_date}</span>
          </div>

          {/* Oy Butonları */}
          {prediction.status === 'active' && !prediction.is_sealed && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleVote('correct')}
                disabled={voted}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                  voted ? 'opacity-50 cursor-not-allowed border-white/5 text-gray-600' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                }`}
              >
                ✅ {lang === 'EN' ? 'Correct' : 'Doğru'} ({votes.correct})
              </button>
              <button
                onClick={() => handleVote('wrong')}
                disabled={voted}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
                  voted ? 'opacity-50 cursor-not-allowed border-white/5 text-gray-600' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                }`}
              >
                ❌ {lang === 'EN' ? 'Wrong' : 'Yanlış'} ({votes.wrong})
              </button>
            </div>
          )}

          {/* Oy Sonuçları */}
          {(votes.correct > 0 || votes.wrong > 0) && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>✅ {votes.correct} {lang === 'EN' ? votes.correct === 1 ? 'vote correct' : 'votes correct' : 'doğru oy'}</span>
                <span>❌ {votes.wrong} {lang === 'EN' ? votes.wrong === 1 ? 'vote wrong' : 'votes wrong' : 'yanlış oy'}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all"
                  style={{ width: `${Math.round((votes.correct / (votes.correct + votes.wrong)) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Paylaş Butonu */}
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition"
          >
            {copied ? '✅ Link Copied!' : `🔗 ${lang === 'EN' ? 'Share this prediction' : 'Bu tahmini paylaş'}`}
          </button>
        </div>

        {/* Arşiv Notu */}
        <div className="text-center text-gray-600 text-xs">
          {lang === 'EN'
            ? 'This prediction is permanently archived on FutureArchive.'
            : 'Bu tahmin FutureArchive\'de kalıcı olarak arşivlenmiştir.'}
        </div>
      </div>
    </main>
  )
}