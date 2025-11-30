import { defineStore } from 'pinia'
import axios from 'axios'

// Create axios instance with defaults
// IMPORTANT: Update baseURL when deploying to production
const api = axios.create({
  // For production with separate hosting, use your backend URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vehiclerental.infinityfreeapp.com/api',
  
  // For local development, use:
  // baseURL: 'http://localhost/Vehicle-Rental/api',
  
  headers: {
    'Content-Type': 'application/json'
  },
  
  // Timeout for requests (optional)
  timeout: 30000,
  
  // Allow credentials (cookies, authorization headers) - enable if needed
  withCredentials: false
})

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const useApiStore = defineStore('api', {
  state: () => ({
    connected: false,
    loading: false,
    error: null
  }),

  actions: {
    /**
     * Check API health
     */
    async checkConnection() {
      try {
        const response = await api.get('/health')
        this.connected = true
        this.error = null
        return response.data
      } catch (error) {
        this.connected = false
        this.error = error.response?.data?.message || 'API connection failed'
        throw error
      }
    },

    /**
     *  GET request
     */
    async get(endpoint) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(endpoint)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'GET request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * POST request
     */
    async post(endpoint, data) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(endpoint, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'POST request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * PUT request
     */
    async put(endpoint, data) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(endpoint, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'PUT request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * DELETE request
     */
    async delete(endpoint) {
      this.loading = true
      this.error = null
      try {
        const response = await api.delete(endpoint)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'DELETE request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * File upload request
     */
    async upload(endpoint, formData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Upload failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null
    }
  }
})
