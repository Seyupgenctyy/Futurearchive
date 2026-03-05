'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Comments({ predictionId }: { predictionId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchComments()
  }, [predictionId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('prediction_id', predictionId)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const handleSubmit = async () => {
    if (!text.trim() || !user) return
    setLoading(true)

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    await supabase.from('comments').insert({
      prediction_id: predictionId,
      user_id: user.id,
      username: profile?.username || user.email?.split('@')[0],
      text: text.trim()
    })

    setText('')
    setLoading(false)
    fetchComments()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-4">
        💬 {lang === 'EN' ? 'Comments' : 'Yorumlar'} ({comments.length})
      </h3>

      {/* Yorum listesi */}
      <div className="flex flex-col gap-3 mb-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-4">
            {lang === 'EN' ? 'No comments yet. Be the first!' : 'Henüz yorum yok. İlk sen ol!'}
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 font-medium">@{c.username}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  {user && c.user_id === user.id && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-300">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Yorum yazma */}
      {user ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={lang === 'EN' ? 'Write a comment...' : 'Yorum yaz...'}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? '...' : lang === 'EN' ? 'Send' : 'Gönder'}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-600 text-center py-2">
          {lang === 'EN' ? 'Sign in to comment.' : 'Yorum yapmak için giriş yapın.'}
        </p>
      )}
    </div>
  )
}