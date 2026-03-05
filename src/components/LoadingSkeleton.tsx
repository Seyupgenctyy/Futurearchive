export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-white/10 rounded-xl p-5 bg-white/5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-20 bg-white/10 rounded-full" />
            <div className="flex gap-2">
              <div className="h-5 w-8 bg-white/10 rounded-full" />
              <div className="h-5 w-16 bg-white/10 rounded-full" />
              <div className="h-5 w-12 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="h-4 w-3/4 bg-white/10 rounded-full mb-2" />
          <div className="h-4 w-1/2 bg-white/10 rounded-full mb-4" />
          <div className="h-3 w-32 bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  )
}