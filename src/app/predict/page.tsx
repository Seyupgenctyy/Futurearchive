'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = [
  'Technology', 'Economy', 'Politics', 'Sports',
  'AI', 'Crypto', 'Turkey', 'Global', 'Crazy Predictions'
]

export default function Predict() {
  const [user, setUser] = useState<any>(null)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [language, setLanguage] = useState('EN')
  const [isSealed, setIsSealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      setUser(data.user)
    })
  }, [])

  const handleSubmit = async () => {
    if (!text || !category || !targetDate) {
      setMessage('Please fill in all fields.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('predictions').insert({
      user_id: user.id,
      text,
      category,
      target_date: targetDate,
      language,
      is_sealed: isSealed,
      status: 'active'
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push('/predict/success')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        <h1 className="text-3xl font-bold mb-2">Make a Prediction</h1>
        <p className="text-gray-400 mb-8">Archive your claim about the future. $1 publishing fee applies.</p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Prediction</label>
            <textarea
              placeholder="I predict that..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    category === cat
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Language</label>
            <div className="flex gap-3">
              {['EN', 'TR'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-6 py-2 rounded-lg text-sm border transition ${
                    language === lang
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
            <input
              type="checkbox"
              id="sealed"
              checked={isSealed}
              onChange={(e) => setIsSealed(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="sealed" className="text-sm text-gray-300 cursor-pointer">
              🔒 Sealed Prediction — hidden until the target date
            </label>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-gray-500">
            ⚠️ This is not gambling. The $1 fee is a publishing fee to permanently archive your prediction.
          </div>

          {message && (
            <p className="text-sm text-red-400">{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? 'Archiving...' : 'Archive My Prediction — $1'}
          </button>
        </div>
      </div>
    </main>
  )
}