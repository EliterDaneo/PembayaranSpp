// composables/useApi.js
const BASE = import.meta.env.VITE_API_BASE_URL || '/api/pembayaran/v1'

export function useApi() {
    async function request(method, path, body = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        }
        if (body) opts.body = JSON.stringify(body)
        const res = await fetch(`${BASE}${path}`, opts)
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Terjadi kesalahan server')
        return json
    }

    // GET /pembayaran?nis=xxx  or  GET /pembayaran?nama=xxx
    function cariSiswa(query) {
        const param = /^\d+$/.test(query.trim())
            ? `nis=${encodeURIComponent(query.trim())}`
            : `nama=${encodeURIComponent(query.trim())}`
        return request('GET', `/pembayaran?${param}`)
    }

    // GET /pembayaran?rfid=xxx
    function cariRFID(rfid) {
        return request('GET', `/pembayaran?rfid=${encodeURIComponent(rfid)}`)
    }

    // POST /pembayaran
    function bayar(payload) {
        return request('POST', '/pembayaran', payload)
    }

    // GET /pembayaran?history=1&siswa_id=xxx
    function riwayat(siswaId) {
        return request('GET', `/pembayaran?history=1&siswa_id=${siswaId}`)
    }

    return { cariSiswa, cariRFID, bayar, riwayat }
}