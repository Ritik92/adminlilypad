'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { adminApiService, BookDemoResponseDto, PageResponse } from '@/services/adminapi'
import { RefreshCw, Filter, ChevronRight, ChevronLeft } from 'lucide-react'

export default function AdminBookings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [bookings, setBookings] = useState<PageResponse<BookDemoResponseDto> | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '0'),
    size: parseInt(searchParams.get('size') || '10'),
    sortBy: searchParams.get('sortBy') || 'createdOn',
    sortDirection: (searchParams.get('sortDirection') || 'DESC') as 'ASC' | 'DESC'
  })

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      let response
      
      if (filters.search) {
        response = await adminApiService.searchBookings(filters.search, {
          page: filters.page,
          size: filters.size
        })
      } else if (filters.status) {
        response = await adminApiService.getBookingsByStatus(filters.status, {
          page: filters.page,
          size: filters.size
        })
      } else {
        response = await adminApiService.getAllBookings({
          page: filters.page,
          size: filters.size,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection
        })
      }
      
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 0 }
    setFilters(updated)
    
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    router.push(`/admin/bookings?${params.toString()}`)
  }

  const changePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
      case 'APPROVED': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
      case 'REJECTED': return 'bg-red-400/10 text-red-400 border-red-400/20'
      case 'CANCELLED': return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
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
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !bookings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-800 rounded-xl w-1/4 mb-6"></div>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-800/50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Demo Bookings</h1>
          <p className="text-slate-400 mt-1">
            {bookings?.totalElements || 0} total bookings
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="inline-flex items-center px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-slate-600"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-200">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Name, email, product..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            >
              <option value="createdOn">Created Date</option>
              <option value="demoDate">Demo Date</option>
              <option value="fullName">Customer Name</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Order</label>
            <select
              value={filters.sortDirection}
              onChange={(e) => updateFilters({ sortDirection: e.target.value as 'ASC' | 'DESC' })}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.status || filters.search) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Status: {filters.status}
                <button
                  onClick={() => updateFilters({ status: '' })}
                  className="ml-2 text-cyan-300 hover:text-cyan-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Search: {filters.search}
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="ml-2 text-cyan-300 hover:text-cyan-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Demo Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings?.content.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <span className="font-mono text-cyan-400">#{booking.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-200">{booking.fullName}</div>
                      <div className="text-sm text-slate-400">{booking.email}</div>
                      <div className="text-sm text-slate-500">{booking.mobileNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200 font-medium">{booking.productName}</div>
                    <div className="text-sm text-slate-400">{booking.productBrand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200">{formatDate(booking.demoDate)}</div>
                    <div className="text-sm text-cyan-400">{formatTime(booking.timeSlot)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200">{booking.city}, {booking.state}</div>
                    <div className="text-sm text-slate-400">{booking.pincode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {formatTimestamp(booking.createdOn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

        {/* Pagination */}
        {bookings && bookings.totalPages > 1 && (
          <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing <span className="text-slate-200">{filters.page * filters.size + 1}</span> to <span className="text-slate-200">{Math.min((filters.page + 1) * filters.size, bookings.totalElements)}</span> of <span className="text-slate-200">{bookings.totalElements}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changePage(Math.max(0, filters.page - 1))}
                disabled={filters.page === 0}
                className="p-2 text-sm border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, bookings.totalPages) }, (_, i) => {
                  const page = i + Math.max(0, filters.page - 2)
                  if (page >= bookings.totalPages) return null
                  
                  return (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-3 py-1.5 text-sm border rounded-xl transition-all ${
                        page === filters.page
                          ? 'bg-cyan-500 text-slate-900 border-cyan-500 font-semibold'
                          : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {page + 1}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => changePage(Math.min(bookings.totalPages - 1, filters.page + 1))}
                disabled={filters.page >= bookings.totalPages - 1}
                className="p-2 text-sm border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {bookings?.content.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
          <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-slate-200">No bookings found</h3>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  )
}