import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, username: string) {
  await resend.emails.send({
    from: 'FutureArchive <onboarding@resend.dev>',
    to: email,
    subject: 'Welcome to FutureArchive',
    html: `
      <div style="background:#0a0a0f;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">Welcome to FutureArchive</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">The archive of future claims.</p>
        <p style="margin-bottom:16px;">Hey @${username},</p>
        <p style="color:#d1d5db;margin-bottom:24px;">
          Your account has been created. You can now archive your predictions about the future.
          Pay $1 to permanently lock your claim — and let history decide if you were right.
        </p>
        <a href="https://futurearchive.vercel.app/predict" 
           style="background:#ffffff;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          Make Your First Prediction
        </a>
        <p style="color:#4b5563;font-size:12px;margin-top:32px;">
          FutureArchive — This is not gambling. Payment is a publishing fee.
        </p>
      </div>
    `
  })
}

export async function sendPredictionArchivedEmail(email: string, username: string, predictionText: string, targetDate: string) {
  await resend.emails.send({
    from: 'FutureArchive <onboarding@resend.dev>',
    to: email,
    subject: 'Your Prediction Has Been Archived',
    html: `
      <div style="background:#0a0a0f;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">Prediction Archived 🎯</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">Your claim has been permanently recorded.</p>
        <p style="margin-bottom:16px;">Hey @${username},</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#d1d5db;font-style:italic;">"${predictionText}"</p>
          <p style="color:#6b7280;font-size:12px;margin-top:12px;">Unlocks: ${targetDate}</p>
        </div>
        <p style="color:#d1d5db;margin-bottom:24px;">
          History is watching. Come back on ${targetDate} to see if you were right.
        </p>
        <a href="https://futurearchive.vercel.app/profile" 
           style="background:#ffffff;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          View Your Profile
        </a>
        <p style="color:#4b5563;font-size:12px;margin-top:32px;">
          FutureArchive — This is not gambling. Payment is a publishing fee.
        </p>
      </div>
    `
  })
}

export async function sendPredictionUnlockedEmail(email: string, username: string, predictionText: string) {
  await resend.emails.send({
    from: 'FutureArchive <onboarding@resend.dev>',
    to: email,
    subject: 'Your Prediction Has Been Unlocked 🔓',
    html: `
      <div style="background:#0a0a0f;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">Your Prediction Is Unlocked 🔓</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">The moment of truth has arrived.</p>
        <p style="margin-bottom:16px;">Hey @${username},</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#d1d5db;font-style:italic;">"${predictionText}"</p>
        </div>
        <p style="color:#d1d5db;margin-bottom:24px;">
          The community is now voting on your prediction. Check your profile to see the verdict.
        </p>
        <a href="https://futurearchive.vercel.app/profile" 
           style="background:#ffffff;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          See The Verdict
        </a>
        <p style="color:#4b5563;font-size:12px;margin-top:32px;">
          FutureArchive — This is not gambling. Payment is a publishing fee.
        </p>
      </div>
    `
  })
}

export async function sendPredictionCorrectEmail(email: string, username: string, predictionText: string, scoreGained: number) {
  await resend.emails.send({
    from: 'FutureArchive <onboarding@resend.dev>',
    to: email,
    subject: '✅ Your Prediction Was Correct!',
    html: `
      <div style="background:#0a0a0f;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">You Were Right! ✅</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">History has spoken.</p>
        <p style="margin-bottom:16px;">Hey @${username},</p>
        <div style="background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="color:#d1d5db;font-style:italic;">"${predictionText}"</p>
          <p style="color:#4ade80;font-size:14px;margin-top:12px;font-weight:600;">+${scoreGained} Prophet Score earned!</p>
        </div>
        <p style="color:#d1d5db;margin-bottom:24px;">
          Share your victory with the world. You predicted it before anyone else.
        </p>
        <a href="https://futurearchive.vercel.app/profile" 
           style="background:#ffffff;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          Share Your Prediction
        </a>
        <p style="color:#4b5563;font-size:12px;margin-top:32px;">
          FutureArchive — This is not gambling. Payment is a publishing fee.
        </p>
      </div>
    `
  })
}

export async function sendWeeklySummaryEmail(email: string, username: string, score: number, rank: number) {
  await resend.emails.send({
    from: 'FutureArchive <onboarding@resend.dev>',
    to: email,
    subject: '📊 Your Weekly FutureArchive Summary',
    html: `
      <div style="background:#0a0a0f;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">Weekly Summary 📊</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">Here's how you're doing as a prophet.</p>
        <p style="margin-bottom:16px;">Hey @${username},</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="color:#9ca3af;">Prophet Score</span>
            <span style="color:#facc15;font-weight:600;">⚡ ${score} pts</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#9ca3af;">Global Rank</span>
            <span style="font-weight:600;">#${rank}</span>
          </div>
        </div>
        <a href="https://futurearchive.vercel.app" 
           style="background:#ffffff;color:#000000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          View Full Archive
        </a>
        <p style="color:#4b5563;font-size:12px;margin-top:32px;">
          FutureArchive — This is not gambling. Payment is a publishing fee.
        </p>
      </div>
    `
  })
}