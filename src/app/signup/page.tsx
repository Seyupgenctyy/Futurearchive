'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const content = {
  EN: {
    back: '← Back to FutureArchive',
    title: 'Create Account',
    subtitle: 'Join the archive of future claims.',
    usernamePlaceholder: 'Username',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    submit: 'Create Account',
    loading: 'Creating...',
    success: 'Account created! Please check your email to confirm.',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
  },
  TR: {
    back: '← FutureArchive\'e Dön',
    title: 'Hesap Oluştur',
    subtitle: 'Gelecek iddialar arşivine katılın.',
    usernamePlaceholder: 'Kullanıcı Adı',
    emailPlaceholder: 'E-posta',
    passwordPlaceholder: 'Şifre',
    submit: 'Hesap Oluştur',
    loading: 'Oluşturuluyor...',
    success: 'Hesap oluşturuldu! Onaylamak için e-postanızı kontrol edin.',
    hasAccount: 'Zaten hesabınız var mı?',
    signIn: 'Giriş yapın',
  }
}

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [lang, setLang] = useState<'EN' | 'TR'>('EN')
  const t = content[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as 'EN' | 'TR'
    if (savedLang) setLang(savedLang)
  }, [])

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username })

      if (profileError) {
        setMessage(profileError.message)
        setLoading(false)
        return
      }

      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'welcome', email, username })
      })

      setMessage(t.success)
    }

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
            type="text"
            placeholder={t.usernamePlaceholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
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
            onClick={handleSignUp}
            disabled={loading}
            className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? t.loading : t.submit}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-400">{message}</p>
        )}

        <p className="text-gray-500 text-sm text-center mt-6">
          {t.hasAccount}{' '}
          <Link href="/login" className="text-white hover:underline">{t.signIn}</Link>
        </p>
      </div>
    </main>
  )
}