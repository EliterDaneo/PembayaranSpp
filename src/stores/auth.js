import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'smkmutuwsb'
const SESSION_KEY = 'admin_session'

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(!!sessionStorage.getItem(SESSION_KEY))
    const loginError = ref('')
    const loginLoading = ref(false)

    const isAdmin = computed(() => isLoggedIn.value)

    function login(password) {
        loginLoading.value = true
        loginError.value = ''

        return new Promise((resolve, reject) => {
            // Simulasi async — di produksi ganti dengan API call
            setTimeout(() => {
                if (password === ADMIN_PASSWORD) {
                    isLoggedIn.value = true
                    sessionStorage.setItem(SESSION_KEY, '1')
                    loginLoading.value = false
                    resolve()
                } else {
                    loginError.value = 'Password salah. Coba lagi.'
                    loginLoading.value = false
                    reject(new Error('Password salah'))
                }
            }, 400)
        })
    }

    function logout() {
        isLoggedIn.value = false
        sessionStorage.removeItem(SESSION_KEY)
        loginError.value = ''
    }

    function clearError() {
        loginError.value = ''
    }

    return { isLoggedIn, isAdmin, loginError, loginLoading, login, logout, clearError }
})