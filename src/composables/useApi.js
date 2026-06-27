// composables/useApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const BASE = `${API_BASE}/api/pembayaran/v1`

// console.log('🌐 API Base URL:', API_BASE)
// console.log('📡 Full API Path:', BASE)

export function useApi() {
    async function request(method, path, body = null) {
        const opts = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }
        if (body) opts.body = JSON.stringify(body)

        const url = `${BASE}${path}`
        // console.log(`📤 ${method} ${url}`)

        const res = await fetch(url, opts)
        const json = await res.json()

        if (!res.ok) {
            // console.error('❌ API Error:', json)
            throw new Error(json.message || 'Terjadi kesalahan server')
        }

        return json
    }

    function cariSiswa(query) {
        const param = /^\d+$/.test(query.trim())
            ? `nis=${encodeURIComponent(query.trim())}`
            : `nama_lengkap=${encodeURIComponent(query.trim())}`
        return request('GET', `/pembayaran?${param}`)
    }

    function cariRFID(rfid) {
        return request('GET', `/pembayaran?rfid=${encodeURIComponent(rfid)}`)
    }

    function bayar(payload) {
        return request('POST', '/pembayaran', payload)
    }

    function riwayat(siswaId) {
        return request('GET', `/pembayaran?history=1&siswa_id=${siswaId}`)
    }

    return { cariSiswa, cariRFID, bayar, riwayat }
}