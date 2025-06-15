'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApiService, BookDemoResponseDto } from '@/services/adminapi'
import { ArrowLeft, User, Package, Calendar, MapPin, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function BookingDetail() {
  const params = useParams()
  const router = useRouter()
  const bookingId = parseInt(params.id as string)
  
  const [booking, setBooking] = useState<BookDemoResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showModal, setShowModal] = useState<'approve' | 'reject' | null>(null)
  const [comments, setComments] = useState('')

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const response = await adminApiService.getBookingById(bookingId)
      setBooking(response.data)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!booking) return
    
    try {
      setActionLoading(true)
      
      if (action === 'approve') {
        await adminApiService.approveBooking(booking.id, comments || undefined)
      } else {
        await adminApiService.rejectBooking(booking.id, comments || undefined)
      }
      
      await fetchBooking()
      setShowModal(null)
      setComments('')
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error)
      alert(`Failed to ${action} booking. Please try again.`)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
          icon: <AlertCircle className="w-4 h-4" />,
          bgGradient: 'from-amber-500/20 to-amber-600/20'
        }
      case 'APPROVED':
        return {
          color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
          icon: <CheckCircle className="w-4 h-4" />,
          bgGradient: 'from-emerald-500/20 to-emerald-600/20'
        }
      case 'REJECTED':
        return {
          color: 'bg-red-400/10 text-red-400 border-red-400/20',
          icon: <XCircle className="w-4 h-4" />,
          bgGradient: 'from-red-500/20 to-red-600/20'
        }
      default:
        return {
          color: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
          icon: <Clock className="w-4 h-4" />,
          bgGradient: 'from-slate-500/20 to-slate-600/20'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-800 rounded-xl w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                  <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-800/50 rounded"></div>
                    <div className="h-4 bg-slate-800/50 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <div className="h-6 bg-slate-800 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-slate-800/50 rounded"></div>
                  <div className="h-10 bg-slate-800/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-slate-200">Booking Not Found</h2>
          <p className="mt-1 text-sm text-slate-400">The booking you're looking for doesn't exist.</p>
          <Link href="/admin/bookings" className="mt-4 inline-block bg-cyan-500 text-slate-900 px-4 py-2 rounded-xl hover:bg-cyan-400 transition-colors font-medium">
            Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(booking.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings" className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
              Booking #{booking.id}
            </h1>
            <p className="text-slate-400 mt-1">Created on {formatTimestamp(booking.createdOn)}</p>
          </div>
        </div>
        
        <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border ${statusConfig.color}`}>
          {statusConfig.icon}
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-200">Customer Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                  <p className="text-slate-200 font-medium">{booking.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                  <a href={`mailto:${booking.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    {booking.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Mobile Number</label>
                  <a href={`tel:${booking.mobileNumber}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    {booking.mobileNumber}
                  </a>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Address</label>
                  <div className="text-slate-200 space-y-1">
                    <p>{booking.addressLine}</p>
                    {booking.landmark && <p className="text-slate-400 text-sm">Landmark: {booking.landmark}</p>}
                    <p className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {booking.city}, {booking.state} - {booking.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product & Demo Information */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Package className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-200">Product & Demo Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                  <label className="block text-sm font-medium text-slate-500 mb-2">Product</label>
                  <p className="text-slate-200 font-semibold text-lg">{booking.productName}</p>
                  <p className="text-slate-400">{booking.productBrand}</p>
                  <p className="text-slate-500 text-xs mt-1">ID: {booking.productId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                  <label className="block text-sm font-medium text-slate-500 mb-2">Demo Schedule</label>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <p className="font-medium">{formatDate(booking.demoDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400 mt-2">
                    <Clock className="w-4 h-4" />
                    <p className="font-medium">{formatTime(booking.timeSlot)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Comments */}
          {booking.adminComments && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/10 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-200">Admin Comments</h2>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                <p className="text-slate-200">{booking.adminComments}</p>
                {booking.processedBy && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-3 pt-3 border-t border-slate-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-slate-900 text-xs font-bold">
                        {booking.processedBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{booking.processedBy}</span>
                    <span className="text-slate-500">•</span>
                    <span>{booking.updatedOn && formatTimestamp(booking.updatedOn)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">Activity Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 font-medium">Booking Created</p>
                  <p className="text-slate-400 text-sm">{formatTimestamp(booking.createdOn)}</p>
                </div>
              </div>
              
              {booking.updatedOn && (
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${statusConfig.bgGradient} rounded-xl flex items-center justify-center mt-0.5`}>
                    {React.cloneElement(statusConfig.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">
                      Booking {booking.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatTimestamp(booking.updatedOn)} by {booking.processedBy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          {booking.status === 'PENDING' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowModal('approve')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 font-semibold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
                >
                  Approve Booking
                </button>
                <button
                  onClick={() => setShowModal('reject')}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/25"
                >
                  Reject Booking
                </button>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 text-sm">Booking ID</span>
                <span className="text-cyan-400 font-mono">#{booking.id}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`text-sm font-medium ${statusConfig.color.split(' ')[1]}`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 text-sm">Created</span>
                <span className="text-slate-200 text-sm">{new Date(booking.createdOn).toLocaleDateString()}</span>
              </div>
              {booking.processedBy && (
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                  <span className="text-slate-400 text-sm">Processed by</span>
                  <span className="text-slate-200 text-sm">{booking.processedBy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Actions */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Related</h3>
            <Link
              href={`/admin/bookings?search=${booking.email}`}
              className="block w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl transition-all text-center text-sm font-medium border border-slate-700 hover:border-slate-600"
            >
              View All Customer Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 w-full max-w-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">
                {showModal === 'approve' ? 'Approve Booking' : 'Reject Booking'}
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to {showModal} this booking?
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {showModal === 'approve' ? 'Comments (Optional)' : 'Rejection Reason'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                  placeholder={showModal === 'approve' ? 'Add any notes...' : 'Please provide a reason for rejection...'}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction(showModal)}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                    showModal === 'approve' 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/25' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/25'
                  }`}
                >
                  {actionLoading ? 'Processing...' : `${showModal === 'approve' ? 'Approve' : 'Reject'} Booking`}
                </button>
                <button
                  onClick={() => {
                    setShowModal(null)
                    setComments('')
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}