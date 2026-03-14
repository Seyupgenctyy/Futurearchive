'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PredictionCard from '@/components/PredictionCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import NotificationBell from '@/components/NotificationBell'

const content = {
  EN: {
    headline: 'Write it. Share it. Prove it.',
    subheadline: 'Archive your predictions about the future — for free.',
    sub2: 'No gambling. No rewards. Just proof.',
    cta: 'Make a Prediction',
    browse: 'Browse Archive',
    howTitle: 'How It Works',
    steps: [
      { n: '01', t: 'Write your prediction' },
      { n: '02', t: 'Choose the target date' },
      { n: '03', t: 'Archive it for free' },
      { n: '04', t: 'Wait and prove you were right' },
    ],
    recentTitle: 'Recent Predictions',
    unlockedTitle: '🔓 Unlocked Today',
    noUnlocked: 'No predictions unlocking today.',
    stats: ['Predictions Archived', 'Active Users', 'Unlocked Today'],
  },
  TR: {
    headline: 'Yaz. Paylaş. Kanıtla.',
    subheadline: 'Geleceğe dair tahminlerini ücretsiz olarak arşivle.',
    sub2: 'Kumar yok. Ödül yok. Sadece kanıt.',
    cta: 'Tahmin Yap',
    browse: 'Arşivi Gez',
    howTitle: 'Nasıl Çalışır?',
    steps: [
      { n: '01', t: 'Tahmininizi yazın' },
      { n: '02', t: 'Hedef tarihi seçin' },
      { n: '03', t: 'Ücretsiz arşivleyin' },
      { n: '04', t: 'Bekleyin ve haklı olduğunuzu kanıtlayın' },
    ],
    recentTitle: 'Son Tahminler',
    unlockedTitle: '🔓 Bugün Açılanlar',
    noUnlocked: 'Bugün açılan tahmin yok.',
    stats: ['Arşivlenen Tahmin', 'Aktif Kullanıcı', 'Bugün Açılan'],
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')
  const [predictions, setPredictions] = useState<any[]>([])
  const [unlocked, setUnlocked] = useState<any[]>([])
  const [totalPredictions, setTotalPredictions] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [predictionsLoading, setPredictionsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = content[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setPredictions(data)
        setPredictionsLoading(false)
      })

    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('predictions')
      .select('*, profiles(username)')
      .eq('target_date', today)
      .then(({ data }) => { if (data) setUnlocked(data) })

    supabase
      .from('predictions')
      .select('id', { count: 'exact' })
      .then(({ count }) => { if (count) setTotalPredictions(count) })

    supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .then(({ count }) => { if (count) setTotalUsers(count) })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-4 border-b border-white/10 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">FutureArchive</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">BETA</span>
        </div>

        {/* Desktop Menü */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => {
              const newLang = lang === 'EN' ? 'TR' : 'EN'
              setLang(newLang)
              localStorage.setItem('lang', newLang)
            }}
            className="text-gray-400 hover:text-white transition text-sm border border-white/10 px-3 py-1 rounded-lg"
          >
            {lang === 'EN' ? '🇹🇷 TR' : '🇬🇧 EN'}
          </button>
          <Link href="/categories" className="text-gray-400 hover:text-white transition text-sm">
            {lang === 'EN' ? 'Categories' : 'Kategoriler'}
          </Link>
          <Link href="/unlocked" className="text-gray-400 hover:text-white transition text-sm">
            {lang === 'EN' ? 'Unlocked Today' : 'Bugün Açılanlar'}
          </Link>
          <Link href="/weekly" className="text-gray-400 hover:text-white transition text-sm">
            {lang === 'EN' ? 'Weekly Top 10' : 'Haftalık Top 10'}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <NotificationBell userId={user.id} />
              <Link href="/profile" className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30 transition">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-400">@{user.email?.split('@')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                {lang === 'EN' ? 'Sign Out' : 'Çıkış'}
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              {lang === 'EN' ? 'Sign In' : 'Giriş Yap'}
            </Link>
          )}
        </div>

        {/* Mobil Sağ */}
        <div className="flex md:hidden items-center gap-3">
          {user && <NotificationBell userId={user.id} />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white transition text-xl p-1"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0a0a0f] border-b border-white/10 px-6 py-4 flex flex-col gap-4 md:hidden z-50">
            <button
              onClick={() => {
                const newLang = lang === 'EN' ? 'TR' : 'EN'
                setLang(newLang)
                localStorage.setItem('lang', newLang)
                setMobileMenuOpen(false)
              }}
              className="text-gray-400 text-sm text-left"
            >
              {lang === 'EN' ? '🇹🇷 TR' : '🇬🇧 EN'}
            </button>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition text-sm">
              {lang === 'EN' ? 'Categories' : 'Kategoriler'}
            </Link>
            <Link href="/unlocked" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition text-sm">
              {lang === 'EN' ? 'Unlocked Today' : 'Bugün Açılanlar'}
            </Link>
            <Link href="/weekly" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition text-sm">
              {lang === 'EN' ? 'Weekly Top 10' : 'Haftalık Top 10'}
            </Link>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition text-sm">
                  @{user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium text-left w-full"
                >
                  {lang === 'EN' ? 'Sign Out' : 'Çıkış'}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium text-center">
                {lang === 'EN' ? 'Sign In' : 'Giriş Yap'}
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="text-xs text-gray-500 tracking-widest uppercase mb-6">
          The Archive of Future Claims
        </div>
        <h1 className="text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          {t.headline}
        </h1>
        <p className="text-gray-400 mt-6 text-lg max-w-xl">{t.subheadline}</p>
        <p className="text-gray-600 mt-2 text-sm">{t.sub2}</p>
        <div className="flex gap-4 mt-10">
          <Link href="/predict" className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
            {t.cta}
          </Link>
          <Link href="/categories" className="border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/5 transition">
            {t.browse}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="flex justify-center gap-16 pb-20">
        <div className="text-center">
          <div className="text-4xl font-bold">{totalPredictions}+</div>
          <div className="text-gray-500 text-sm mt-1">{t.stats[0]}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{totalUsers}+</div>
          <div className="text-gray-500 text-sm mt-1">{t.stats[1]}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{unlocked.length}</div>
          <div className="text-gray-500 text-sm mt-1">{t.stats[2]}</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-semibold mb-8 text-gray-300 text-center">{t.howTitle}</h2>
        <div className="grid grid-cols-2 gap-4">
          {t.steps.map((step) => (
            <div key={step.n} className="border border-white/10 rounded-xl p-5 bg-white/5">
              <div className="text-3xl font-bold text-white/20 mb-2">{step.n}</div>
              <div className="text-white font-medium">{step.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Unlocked Today */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-semibold mb-6 text-gray-300">{t.unlockedTitle}</h2>
        {unlocked.length === 0 ? (
          <p className="text-gray-600 text-sm">{t.noUnlocked}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {unlocked.map((p) => (
              <div key={p.id} className="border border-white/10 rounded-xl p-5 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">@{p.profiles?.username}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">{p.category}</span>
                </div>
                <p className="text-white">{p.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Predictions */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-semibold mb-6 text-gray-300">{t.recentTitle}</h2>
        {predictionsLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {predictions.length === 0 ? (
              <p className="text-gray-600 text-sm">
                {lang === 'EN' ? 'No predictions yet.' : 'Henüz tahmin yok.'}
              </p>
            ) : (
              predictions.map((p) => (
                <PredictionCard key={p.id} prediction={p} showVotes={false} />
              ))
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-8 text-gray-600 text-sm">
        <Link href="/disclaimer" className="text-gray-600 hover:text-gray-400 transition underline">
          Legal Disclaimer
        </Link>
        {' · '}© 2026 FutureArchive. All rights reserved.
      </footer>
    </main>
  )
}