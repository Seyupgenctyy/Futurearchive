import Link from 'next/link'

export default function PredictSuccess() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎯</div>
        <h1 className="text-3xl font-bold mb-4">Prediction Archived!</h1>
        <p className="text-gray-400 mb-8">
          Your prediction has been permanently archived. History will decide if you were right.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/predict" className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-center">
            Make Another Prediction
          </Link>
          <Link href="/" className="border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/5 transition text-center">
            Back to Archive
          </Link>
        </div>
      </div>
    </main>
  )
}