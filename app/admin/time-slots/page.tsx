'use client'

import { useState, useEffect } from 'react'
import { adminApiService, TimeSlotDto } from '@/services/adminapi'

// app/admin/time-slots/page.tsx
export default function TimeSlotManagement() {
  const [slots, setSlots] = useState<TimeSlotDto[]>([])
  const [loading, setLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [generateForm, setGenerateForm] = useState({
    startDate: '',
    endDate: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (selectedDate) {
      fetchSlots()
    }
  }, [selectedDate])

  const fetchSlots = async () => {
    try {
      setLoading(true)
      const response = await adminApiService.getAvailableTimeSlots(selectedDate)
      setSlots(response.data)
    } catch (error) {
      console.error('Error fetching slots:', error)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSlots = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!generateForm.startDate || !generateForm.endDate) {
      setMessage('Please select both start and end dates')
      return
    }

    if (new Date(generateForm.startDate) > new Date(generateForm.endDate)) {
      setMessage('Start date must be before end date')
      return
    }

    try {
      setGenerateLoading(true)
      setMessage('')
      
      const response = await adminApiService.generateTimeSlots(
        generateForm.startDate,
        generateForm.endDate
      )
      
      setMessage(response.data.message || 'Time slots generated successfully!')
      
      // Refresh slots if current date is in the generated range
      if (selectedDate >= generateForm.startDate && selectedDate <= generateForm.endDate) {
        await fetchSlots()
      }
      
      // Reset form
      setGenerateForm({ startDate: '', endDate: '' })
    } catch (error: any) {
      console.error('Error generating slots:', error)
      setMessage(error.response?.data?.message || 'Failed to generate time slots')
    } finally {
      setGenerateLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Slots Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate and view demo time slots for different dates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generate Time Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generate Time Slots</h2>
          
          <form onSubmit={handleGenerateSlots} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={generateForm.startDate}
                onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={generateForm.endDate}
                onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                min={generateForm.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={generateLoading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateLoading ? 'Generating...' : 'Generate Time Slots'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('successfully') || message.includes('Generated')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Standard Time Slots</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              The system generates slots at:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-400 mt-1 list-disc list-inside">
              <li>10:00 AM - 11:00 AM</li>
              <li>01:00 PM - 02:00 PM</li>
              <li>04:00 PM - 05:00 PM</li>
            </ul>
          </div>
        </div>

        {/* View Time Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">View Time Slots</h2>
            <button
              onClick={fetchSlots}
              disabled={loading}
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {formatDate(selectedDate)}
              </h3>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : slots.length > 0 ? (
            <div className="space-y-3">
              {slots.map((slot, index) => (
                <div
                  key={slot.id || index}
                  className={`p-4 rounded-lg border-2 ${
                    slot.available
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          slot.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {slot.available ? 'Available' : 'Full'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {slot.remainingSlots} slots remaining
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {slot.remainingSlots}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        remaining
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No slots available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No time slots found for this date. Generate slots to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {slots.filter(slot => slot.available).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available Slots Today</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {slots.reduce((total, slot) => total + slot.remainingSlots, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {slots.filter(slot => !slot.available).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fully Booked Slots</div>
          </div>
        </div>
      </div>
    </div>
  )
}