import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// Request interceptor — bisa ditambah token auth di sini
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor — normalisasi error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const msg =
            error.response?.data?.message ||
            error.message ||
            'Terjadi kesalahan jaringan'
        return Promise.reject(new Error(msg))
    }
)

export default api