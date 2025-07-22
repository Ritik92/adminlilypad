'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminApiService, BookDemoResponseDto } from '@/services/adminapi'
import { RefreshCw, ChevronRight } from 'lucide-react'

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookDemoResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await adminApiService.getAllBookings({ page: 0, size: 50 })
      setBookings(response.data.content || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
      case 'APPROVED': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
      case 'REJECTED': return 'bg-red-400/10 text-red-400 border-red-400/20'
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
            Demo Bookings
          </h1>
          <p className="text-slate-400 mt-1">{bookings.length} total bookings</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="inline-flex items-center px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Demo Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-mono">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-200">{booking.fullName}</div>
                      <div className="text-sm text-slate-400">{booking.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200">{booking.productName}</div>
                    <div className="text-sm text-slate-400">{booking.productBrand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200">{formatDate(booking.demoDate)}</div>
                    <div className="text-sm text-cyan-400">{formatTime(booking.timeSlot)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link 
                      href={`/admin/bookings/${booking.id}`} 
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-200">No bookings found</h3>
          <p className="mt-1 text-sm text-slate-400">Check back later for new bookings.</p>
        </div>
      )}
    </div>
  )
}