'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApiService, BookDemoResponseDto } from '@/services/adminapi'

// app/admin/bookings/[id]/page.tsx
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
      
      // Refresh booking data
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
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
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Booking Not Found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The booking you're looking for doesn't exist.</p>
          <Link href="/admin/bookings" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings" className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking #{booking.id}</h1>
            <p className="text-gray-600 dark:text-gray-400">Created on {formatTimestamp(booking.createdOn)}</p>
          </div>
        </div>
        
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                  <p className="text-gray-900 dark:text-white">{booking.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <a href={`mailto:${booking.email}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {booking.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number</label>
                  <a href={`tel:${booking.mobileNumber}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {booking.mobileNumber}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                <div className="text-gray-900 dark:text-white">
                  <p>{booking.addressLine}</p>
                  {booking.landmark && <p className="text-gray-600 dark:text-gray-400">Landmark: {booking.landmark}</p>}
                  <p>{booking.city}, {booking.state} - {booking.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product & Demo Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product & Demo Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Product</label>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.productName}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{booking.productBrand}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">ID: {booking.productId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Demo Date</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(booking.demoDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Time Slot</label>
                  <p className="text-gray-900 dark:text-white">{formatTime(booking.timeSlot)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Comments */}
          {booking.adminComments && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Admin Comments</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white">{booking.adminComments}</p>
                {booking.processedBy && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    By {booking.processedBy} • {booking.updatedOn && formatTimestamp(booking.updatedOn)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Booking Created</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{formatTimestamp(booking.createdOn)}</p>
                </div>
              </div>
              
              {booking.updatedOn && (
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    booking.status === 'APPROVED' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Booking {booking.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowModal('approve')}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve Booking
                </button>
                <button
                  onClick={() => setShowModal('reject')}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Booking
                </button>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Booking ID</span>
                <span className="text-gray-900 dark:text-white">#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className={`text-sm ${booking.status === 'PENDING' ? 'text-yellow-600' : booking.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white text-sm">{new Date(booking.createdOn).toLocaleDateString()}</span>
              </div>
              {booking.processedBy && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Processed by</span>
                  <span className="text-gray-900 dark:text-white text-sm">{booking.processedBy}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/bookings?search=${booking.email}`}
                className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center text-sm"
              >
                View Customer Bookings
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {showModal === 'approve' ? 'Approve Booking' : 'Reject Booking'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Are you sure you want to {showModal} this booking?
              </p>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {showModal === 'approve' ? 'Comments (Optional)' : 'Rejection Reason'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={showModal === 'approve' ? 'Add any notes...' : 'Please provide a reason for rejection...'}
                />
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleAction(showModal)}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    showModal === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {actionLoading ? 'Processing...' : `${showModal === 'approve' ? 'Approve' : 'Reject'} Booking`}
                </button>
                <button
                  onClick={() => {
                    setShowModal(null)
                    setComments('')
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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