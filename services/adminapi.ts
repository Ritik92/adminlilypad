// services/adminApi.ts
import axios from 'axios'

const API_BASE = 'http://localhost:8081/api/v1'

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('admin-token='))
    ?.split('=')[1]
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Types based on your backend
export interface BookDemoResponseDto {
  id: number
  fullName: string
  email: string
  mobileNumber: string
  addressLine: string
  pincode: string
  city: string
  landmark?: string
  state: string
  productId: string
  productName: string
  productBrand: string
  demoDate: string // LocalDate as string
  timeSlot: string // LocalTime as string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
  adminComments?: string
  createdOn: number
  updatedOn?: number
  approvedOn?: number
  rejectedOn?: number
  processedBy?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ResponseMessage {
  message: string
}

export interface TimeSlotDto {
  id?: number
  date: string
  startTime: string
  endTime: string
  available: boolean
  remainingSlots: number
}

// Admin API functions
export const adminApiService = {
  // Get all bookings with pagination
  getAllBookings: (params: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
  } = {}) => {
    const queryParams = new URLSearchParams({
      page: (params.page || 0).toString(),
      size: (params.size || 10).toString(),
      sortBy: params.sortBy || 'createdOn',
      sortDirection: params.sortDirection || 'DESC'
    })
    
    return adminApi.get<PageResponse<BookDemoResponseDto>>(`/admin/demo-bookings?${queryParams}`)
  },

  // Get bookings by status
  getBookingsByStatus: (status: string, params: {
    page?: number
    size?: number
  } = {}) => {
    const queryParams = new URLSearchParams({
      page: (params.page || 0).toString(),
      size: (params.size || 10).toString()
    })
    
    return adminApi.get<PageResponse<BookDemoResponseDto>>(`/admin/demo-bookings/status/${status}?${queryParams}`)
  },

  // Search bookings
  searchBookings: (searchTerm: string, params: {
    page?: number
    size?: number
  } = {}) => {
    const queryParams = new URLSearchParams({
      searchTerm,
      page: (params.page || 0).toString(),
      size: (params.size || 10).toString()
    })
    
    return adminApi.get<PageResponse<BookDemoResponseDto>>(`/admin/demo-bookings/search?${queryParams}`)
  },

  // Get booking by ID
  getBookingById: (bookingId: number) => {
    return adminApi.get<BookDemoResponseDto>(`/admin/demo-bookings/${bookingId}`)
  },

  // Approve booking
  approveBooking: (bookingId: number, adminComments?: string, adminEmail: string = 'admin@lilypad.com') => {
    const params = new URLSearchParams({
      adminEmail
    })
    
    if (adminComments) {
      params.append('adminComments', adminComments)
    }
    
    return adminApi.post<ResponseMessage>(`/admin/demo-bookings/${bookingId}/approve?${params}`)
  },

  // Reject booking
  rejectBooking: (bookingId: number, adminComments?: string, adminEmail: string = 'admin@lilypad.com') => {
    const params = new URLSearchParams({
      adminEmail
    })
    
    if (adminComments) {
      params.append('adminComments', adminComments)
    }
    
    return adminApi.post<ResponseMessage>(`/admin/demo-bookings/${bookingId}/reject?${params}`)
  },

  // Generate time slots
  generateTimeSlots: (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate
    })
    
    return adminApi.post<ResponseMessage>(`/admin/generate-time-slots?${params}`)
  },

  // Get available time slots for a date
  getAvailableTimeSlots: (date: string) => {
    return adminApi.get<TimeSlotDto[]>(`/demo-slots?date=${date}`)
  }
}

export default adminApiService