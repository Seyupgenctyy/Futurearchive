'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    if (data) setNotifications(data)
  }

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead() }}
        className="relative text-gray-400 hover:text-white transition p-1"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-[#1a1a2e] border border-white/10 rounded-xl p-3 z-50 w-72 shadow-xl">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 px-1">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-600 px-1 py-3 text-center">No notifications yet.</p>
          ) : (
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-3 py-2 rounded-lg text-xs transition ${
                    n.is_read ? 'text-gray-500' : 'text-white bg-white/5'
                  }`}
                >
                  <p>{n.message}</p>
                  <p className="text-gray-600 mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}