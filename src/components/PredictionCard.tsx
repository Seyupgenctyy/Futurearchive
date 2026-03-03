'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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
    profiles?: { username: string }
  }
  showVotes?: boolean
}

export default function PredictionCard({ prediction: p, showVotes = true }: PredictionCardProps) {
  const [voted, setVoted] = useState(false)
  const [votes, setVotes] = useState({
    correct: p.votes_correct || 0,
    wrong: p.votes_wrong || 0
  })

  const handleVote = async (type: 'correct' | 'wrong') => {
    if (voted) return
    setVoted(true)

    const update = type === 'correct'
      ? { votes_correct: votes.correct + 1 }
      : { votes_wrong: votes.wrong + 1 }

    await supabase
      .from('predictions')
      .update(update)
      .eq('id', p.id)

    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }))
  }

  const statusColors: Record<string, string> = {
    correct: 'bg-green-500/20 text-green-400',
    wrong: 'bg-red-500/20 text-red-400',
    active: 'bg-white/10 text-gray-400',
    pending_payment: 'bg-yellow-500/20 text-yellow-400',
  }

  return (
    <div className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition bg-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">
          @{p.profiles?.username || 'anonymous'}
        </span>
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
        </div>
      </div>

      {/* Content */}
      {p.is_sealed && p.status === 'active' ? (
        <div className="flex items-center gap-2 text-gray-500 italic">
          <span>🔒</span>
          <span>Sealed until {p.target_date}</span>
        </div>
      ) : (
        <p className="text-white leading-relaxed">{p.text}</p>
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