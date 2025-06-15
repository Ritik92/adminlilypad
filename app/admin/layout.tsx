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
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/admin/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleSidebar} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-slate-800"
            >
              <SidebarContent onLogout={handleLogout} pathname={pathname} closeSidebar={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
          <SidebarContent onLogout={handleLogout} pathname={pathname} />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-cyan-400 transition-colors lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search Bar */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 h-5 w-5 text-slate-500" />
              <input
                className="block h-full w-full border-0 bg-slate-800/50 py-0 pl-10 pr-4 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:bg-slate-800/70 sm:text-sm rounded-xl transition-all"
                placeholder="Search bookings..."
                type="search"
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button className="relative p-2.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-800/50">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></span>
            </button>

            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-700" />

            <div className="relative">
              <div className="flex items-center text-sm text-slate-300 cursor-pointer hover:bg-slate-800/50 rounded-xl p-2 transition-all">
                <div className="h-8 w-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-slate-900 font-bold">A</span>
                </div>
                <span className="ml-3 hidden lg:block font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-8">
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
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BookOpen className="h-6 w-6 text-slate-900" />
          </div>
          <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">LilyPad Admin</span>
        </div>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="ml-auto p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="space-y-1.5">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
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
              className="group flex w-full gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium text-slate-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 shrink-0 group-hover:text-red-400" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}