'use client'

import { Suspense, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  Bell,
  Search
} from 'lucide-react'

// app/admin/layout.tsx (or components/admin/AdminLayout.tsx)
interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  
  {
    name: 'All Bookings',
    href: '/admin/bookings',
    icon: BookOpen
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Remove admin token
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/admin/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-900/80" onClick={toggleSidebar} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-800 shadow-xl"
            >
              <SidebarContent onLogout={handleLogout} pathname={pathname} closeSidebar={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <SidebarContent onLogout={handleLogout} pathname={pathname} />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-800/95 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search Bar */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" />
              <input
                className="block h-full w-full border-0 bg-gray-900/50 py-0 pl-10 pr-4 text-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 focus:ring-inset sm:text-sm rounded-lg"
                placeholder="Search bookings..."
                type="search"
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button className="relative p-2 text-gray-400 hover:text-cyan-400 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-400 rounded-full"></span>
            </button>

            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-600" />

            <div className="relative">
              <div className="flex items-center text-sm text-gray-300">
                <div className="h-8 w-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-semibold">A</span>
                </div>
                <span className="ml-2 hidden lg:block">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
              <Suspense>
       {children}
    </Suspense>
          
          </div>
        </main>
      </div>
    </div>
  )
}

// Sidebar Content Component
function SidebarContent({ 
  onLogout, 
  pathname, 
  closeSidebar 
}: { 
  onLogout: () => void
  pathname: string
  closeSidebar?: () => void 
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-gray-900" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">LilyPad Admin</span>
        </div>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="ml-auto p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-all
                        ${isActive
                          ? 'bg-cyan-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* Logout */}
          <li className="mt-auto">
            <button
              onClick={onLogout}
              className="group -mx-2 flex w-full gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}