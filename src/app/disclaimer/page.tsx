import Link from 'next/link'

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-500 text-sm hover:text-white transition mb-8 block">
          ← Back to FutureArchive
        </Link>

        <h1 className="text-3xl font-bold mb-2">Legal Disclaimer</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

        <div className="flex flex-col gap-8 text-gray-300 leading-relaxed">

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">1. Not a Gambling Platform</h2>
            <p>FutureArchive is not a gambling, betting, or wagering platform. No financial rewards, prizes, or monetary compensation of any kind are offered to users based on the accuracy of their predictions. The platform does not operate as a game of chance.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">2. Publishing Fee</h2>
            <p>The $1 payment required to publish a prediction is strictly a publishing and archiving fee. This fee covers the cost of permanently storing your prediction in our digital archive. It is non-refundable and does not constitute entry into any contest, lottery, or game.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">3. User-Generated Content</h2>
            <p>All predictions published on FutureArchive are user-generated content. FutureArchive does not endorse, verify, or take responsibility for the accuracy, legality, or appropriateness of any prediction submitted by users.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">4. No Accuracy Guarantee</h2>
            <p>FutureArchive does not guarantee the accuracy of any prediction. The platform is designed purely as a digital archive and reputation system. Prophet Scores are for entertainment and community purposes only and carry no monetary value.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">5. Internationally Acceptable Use</h2>
            <p>FutureArchive is designed to comply with international digital publishing standards. Users are responsible for ensuring their use of the platform complies with local laws and regulations in their jurisdiction.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-3">6. Contact</h2>
            <p>For any legal inquiries, please contact us at: <span className="text-white">legal@futurearchive.com</span></p>
          </div>

        </div>

        <div className="mt-12 border border-white/10 rounded-xl p-5 bg-white/5 text-center">
          <p className="text-gray-400 text-sm">
            ⚠️ FutureArchive — This is not gambling. Payment is a publishing fee.
          </p>
        </div>
      </div>
    </main>
  )
}