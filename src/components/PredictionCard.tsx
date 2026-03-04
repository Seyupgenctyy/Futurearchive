'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface PredictionCardProps {
  prediction: {
    id: string
    text: string
    category: string
    target_date: string
    language: string
    is_sealed: boolean
    status: string
    votes_correct: number
    votes_wrong: number
    user_id?: string
    profiles?: { username: string }
  }
  showVotes?: boolean
  onDelete?: (id: string) => void
}

export default function PredictionCard({ prediction: p, showVotes = true, onDelete }: PredictionCardProps) {
  const [voted, setVoted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`voted_${p.id}`) === 'true'
    }
    return false
  })
  const [votes, setVotes] = useState({
    correct: p.votes_correct || 0,
    wrong: p.votes_wrong || 0
  })
  const [reported, setReported] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deleted, setDeleted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id)
    })
  }, [])

  const handleVote = async (type: 'correct' | 'wrong') => {
    if (voted) return
    setVoted(true)
    localStorage.setItem(`voted_${p.id}`, 'true')
    const update = type === 'correct'
      ? { votes_correct: votes.correct + 1 }
      : { votes_wrong: votes.wrong + 1 }
    await supabase.from('predictions').update(update).eq('id', p.id)
    setVotes(prev => ({ ...prev, [type]: prev[type] + 1 }))
  }

  const handleReport = async (reason: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('reports').insert({
      reporter_id: user.id,
      prediction_id: p.id,
      reason
    })
    setReported(true)
    setShowReportMenu(false)
  }

  const handleDelete = async () => {
    await supabase.from('predictions').delete().eq('id', p.id)
    setDeleted(true)
    setShowReportMenu(false)
    if (onDelete) onDelete(p.id)
  }

  const isOwner = currentUserId && p.user_id && currentUserId === p.user_id

  const statusColors: Record<string, string> = {
    correct: 'bg-green-500/20 text-green-400',
    wrong: 'bg-red-500/20 text-red-400',
    active: 'bg-white/10 text-gray-400',
    pending_payment: 'bg-yellow-500/20 text-yellow-400',
  }

  if (deleted) return null

  return (
    <div className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition bg-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link href={`/profile/${p.profiles?.username}`} className="text-xs text-gray-500 hover:text-gray-300 transition">
          @{p.profiles?.username || 'anonymous'}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 border border-white/10 px-2 py-0.5 rounded-full">
            {p.language}
          </span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">
            {p.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[p.status] || statusColors.active}`}>
            {p.status === 'pending_payment' ? '⏳ pending' : p.status}
          </span>

          {/* Üç nokta menüsü */}
          <div className="relative">
            <button
              onClick={() => setShowReportMenu(!showReportMenu)}
              className="text-gray-600 hover:text-gray-400 transition text-xs px-1"
            >
              ⋯
            </button>
            {showReportMenu && (
              <div className="absolute right-0 top-6 bg-[#1a1a2e] border border-white/10 rounded-lg p-2 z-10 min-w-40">
                {showDeleteConfirm ? (
                  <div className="px-2 py-1">
                    <p className="text-xs text-gray-400 mb-2">Are you sure?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="flex-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 text-xs text-gray-400 border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : reported ? (
                  <p className="text-xs text-gray-400 px-2 py-1">✅ Reported</p>
                ) : (
                  <>
                    {isOwner && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="block w-full text-left text-xs text-red-400 hover:text-red-300 px-2 py-1.5 rounded hover:bg-white/5 transition"
                      >
                        🗑 Delete
                      </button>
                    )}
                    <p className="text-xs text-gray-500 px-2 py-1 mb-1">Report</p>
                    {['Spam', 'Inappropriate', 'Misleading', 'Other'].map(reason => (
                      <button
                        key={reason}
                        onClick={() => handleReport(reason)}
                        className="block w-full text-left text-xs text-gray-400 hover:text-white px-2 py-1.5 rounded hover:bg-white/5 transition"
                      >
                        {reason}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {p.is_sealed && p.status === 'active' ? (
        <div className="flex items-center gap-2 text-gray-500 italic">
          <span>🔒</span>
          <span>Sealed until {p.target_date}</span>
        </div>
      ) : (
        <Link href={`/prediction/${p.id}`} className="text-white leading-relaxed hover:text-gray-300 transition cursor-pointer block">
          {p.text}
        </Link>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-600">
          🗓 Unlocks: {p.target_date}
        </span>
        {p.is_sealed && p.status === 'active' && (
          <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-500">
            🔒 Silent Prophet
          </span>
        )}
      </div>

      {/* Vote Buttons */}
      {showVotes && p.status === 'active' && !p.is_sealed && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleVote('correct')}
            disabled={voted}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs border transition ${
              voted
                ? 'opacity-50 cursor-not-allowed border-white/5 text-gray-600'
                : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
            }`}
          >
            ✅ Correct ({votes.correct})
          </button>
          <button
            onClick={() => handleVote('wrong')}
            disabled={voted}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs border transition ${
              voted
                ? 'opacity-50 cursor-not-allowed border-white/5 text-gray-600'
                : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
            }`}
          >
            ❌ Wrong ({votes.wrong})
          </button>
        </div>
      )}
    </div>
  )
}