import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendPredictionArchivedEmail, sendPredictionCorrectEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { type, email, username, predictionText, targetDate, scoreGained } = await req.json()

  try {
    if (type === 'welcome') {
      await sendWelcomeEmail(email, username)
    } else if (type === 'archived') {
      await sendPredictionArchivedEmail(email, username, predictionText, targetDate)
    } else if (type === 'correct') {
      await sendPredictionCorrectEmail(email, username, predictionText, scoreGained)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }
}