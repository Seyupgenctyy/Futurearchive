import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import PredictionDetailClient from './PredictionDetailClient'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const { data } = await supabase
    .from('predictions')
    .select('*, profiles(username)')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Prediction Not Found | FutureArchive' }

  const username = data.profiles?.username || 'anonymous'
  const text = data.is_sealed && data.status === 'active'
    ? `Sealed prediction by @${username}`
    : data.text

  const shortText = text.length > 60 ? text.slice(0, 60) + '...' : text
  const description = `@${username} predicted: "${shortText}" — Unlocks: ${data.target_date}`

  return {
    title: `${shortText} | FutureArchive`,
    description,
    openGraph: {
      title: `@${username}'s Prediction | FutureArchive`,
      description,
      url: `https://futurearchive.vercel.app/prediction/${id}`,
      siteName: 'FutureArchive',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `@${username}'s Prediction | FutureArchive`,
      description,
    },
  }
}

export default async function PredictionPage({ params }: Props) {
  const { id } = await params
  return <PredictionDetailClient id={id} />
}