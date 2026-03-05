'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const content = {
  EN: {
    back: '← Back to FutureArchive',
    title: 'Welcome Back',
    subtitle: 'Sign in to your archive.',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    submit: 'Sign In',
    loading: 'Signing in...',
    noAccount: "Don't have an account?",
    createOne: 'Create one',
  },
  TR: {
    back: '← FutureArchive\'e Dön',
    title: 'Tekrar Hoşgeldiniz',
    subtitle: 'Arşivinize giriş yapın.',
    emailPlaceholder: 'E-posta',
    passwordPlaceholder: 'Şifre',
    submit: 'Giriş Yap',
    loading: 'Giriş yapılıyor...',
    noAccount: 'Hesabınız yok mu?',
    createOne: 'Oluşturun',
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')
  const router = useRouter()
  const t = content[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          {t.back}
        </Link>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.subtitle}</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
          <input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? t.loading : t.submit}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-red-400">{message}</p>
        )}

        <p className="text-gray-500 text-sm text-center mt-6">
          {t.noAccount}{' '}
          <Link href="/signup" className="text-white hover:underline">{t.createOne}</Link>
        </p>
      </div>
    </main>
  )
}