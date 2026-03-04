'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Admin() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [dailyCount, setDailyCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'predictions' | 'users'>('predictions')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    // Aktif tahminler
    const { data: preds } = await supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('status', 'active')
      .order('target_date', { ascending: true })
    if (preds) setPredictions(preds)

    // Kullanıcılar
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .order('prophet_score', { ascending: false })
    if (users) setUsers(users)

    // Günlük tahmin sayısı
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('predictions')
      .select('id', { count: 'exact' })
      .gte('created_at', today)
    if (count) setDailyCount(count)

    // Toplam gelir
    const { count: paymentCount } = await supabase
      .from('payments')
      .select('id', { count: 'exact' })
      .eq('payment_status', 'completed')
    if (paymentCount) setTotalRevenue(paymentCount)
  }

  const handleVerdict = async (id: string, isCorrect: boolean) => {
  setLoading(true)
  const newStatus = isCorrect ? 'correct' : 'wrong'

  await supabase
    .from('predictions')
    .update({ status: newStatus })
    .eq('id', id)

  setPredictions(prev => prev.filter(p => p.id !== id))
  setLoading(false)
}

  const handleDelete = async (id: string) => {
    await supabase.from('predictions').delete().eq('id', id)
    setPredictions(prev => prev.filter(p => p.id !== id))
  }

  const handleResetScore = async (userId: string) => {
    await supabase
      .from('profiles')
      .update({ prophet_score: 0 })
      .eq('id', userId)
    fetchAll()
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage predictions, users and revenue.</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold">{predictions.length}</div>
            <div className="text-gray-500 text-xs mt-1">Pending Verdicts</div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-gray-500 text-xs mt-1">Total Users</div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold">{dailyCount}</div>
            <div className="text-gray-500 text-xs mt-1">Today's Predictions</div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-center">
            <div className="text-2xl font-bold text-green-400">${totalRevenue}</div>
            <div className="text-gray-500 text-xs mt-1">Total Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-4 py-2 rounded-lg text-sm border transition ${
              activeTab === 'predictions'
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            📋 Predictions ({predictions.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm border transition ${
              activeTab === 'users'
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="flex flex-col gap-4">
            {predictions.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No active predictions to verify.</p>
            ) : (
              predictions.map((p) => (
                <div key={p.id} className="border border-white/10 rounded-xl p-5 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">@{p.profiles?.username || 'anonymous'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">{p.category}</span>
                      <span className="text-xs text-gray-600">{p.language}</span>
                    </div>
                  </div>
                  <p className="text-white mb-2">{p.text}</p>
                  <p className="text-xs text-gray-600 mb-4">🗓 Target: {p.target_date}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerdict(p.id, true)}
                      disabled={loading}
                      className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 py-2 rounded-lg text-sm font-medium hover:bg-green-500/30 transition disabled:opacity-50"
                    >
                      ✅ Correct
                    </button>
                    <button
                      onClick={() => handleVerdict(p.id, false)}
                      disabled={loading}
                      className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition disabled:opacity-50"
                    >
                      ❌ Wrong
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={loading}
                      className="bg-white/5 text-gray-400 border border-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4 bg-white/5">
                <div>
                  <div className="font-medium">@{u.username}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Score: {u.prophet_score} pts</div>
                </div>
                <button
                  onClick={() => handleResetScore(u.id)}
                  className="text-xs text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                >
                  Reset Score
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}