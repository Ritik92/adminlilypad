'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react'

// app/admin/dashboard/page.tsx
interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  rejectedBookings: number
  todayBookings: number
  weekGrowth: number
}

interface RecentBooking {
  id: number
  fullName: string
  email: string
  productName: string
  demoDate: string
  timeSlot: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdOn: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  // Simulate API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API calls
        setStats({
          totalBookings: 1247,
          pendingBookings: 23,
          approvedBookings: 1089,
          rejectedBookings: 135,
          todayBookings: 8,
          weekGrowth: 12.5
        })

        setRecentBookings([
          {
            id: 1,
            fullName: 'Raj Kumar Singh',
            email: 'raj@example.com',
            productName: 'Hero Electric Photon',
            demoDate: '2025-06-20',
            timeSlot: '10:00',
            status: 'PENDING',
            createdOn: Date.now() - 3600000
          },
          {
            id: 2,
            fullName: 'Priya Sharma',
            email: 'priya@example.com',
            productName: 'Ola S1 Pro',
            demoDate: '2025-06-21',
            timeSlot: '13:00',
            status: 'APPROVED',
            createdOn: Date.now() - 7200000
          },
          {
            id: 3,
            fullName: 'Arjun Patel',
            email: 'arjun@example.com',
            productName: 'Ather 450X',
            demoDate: '2025-06-19',
            timeSlot: '16:00',
            status: 'PENDING',
            createdOn: Date.now() - 10800000
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
      case 'APPROVED': return 'text-green-400 bg-green-400/10'
      case 'REJECTED': return 'text-red-400 bg-red-400/10'
      case 'CANCELLED': return 'text-gray-400 bg-gray-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-4 h-4" />
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />
      case 'REJECTED': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.totalBookings}</p>
            </div>
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+{stats?.weekGrowth}%</span>
            <span className="text-gray-400 ml-1">from last week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.pendingBookings}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/bookings?status=PENDING" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
              View pending <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.approvedBookings}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/bookings?status=APPROVED" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
              View approved <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today's Demos</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.todayBookings}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/bookings?date=today" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
              View today's <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-xl border border-gray-700"
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
            <Link 
              href="/admin/bookings" 
              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
            >
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {recentBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-6 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-900 font-semibold text-sm">
                          {booking.fullName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{booking.fullName}</p>
                      <p className="text-gray-400 text-sm">{booking.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                    <span>{booking.productName}</span>
                    <span>•</span>
                    <span>{booking.demoDate} at {booking.timeSlot}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(booking.createdOn)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/time-slots"
              className="block w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
            >
              Generate Time Slots
            </Link>
            <Link
              href="/admin/bookings?status=PENDING"
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
            >
              Review Pending Bookings
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Status</span>
              <span className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email Service</span>
              <span className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}