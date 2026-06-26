import api from './axios.js'

/**
 * GET /pembayaran
 * Ambil daftar pembayaran + tagihan siswa berdasarkan NIS atau nama
 *
 * @param {Object} params - { nis?, nama?, kelas_id?, tahun_ajaran?, bulan? }
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export function getPembayaran(params = {}) {
    return api.get('/pembayaran', { params }).then((r) => r.data)
}

/**
 * GET /pembayaran?nis=xxx
 * Cari siswa + tagihan tertunggak berdasarkan NIS
 *
 * @param {string} nis
 * @returns {Promise<Object>}
 */
export function getSiswaByNis(nis) {
    return api.get('/pembayaran', { params: { nis } }).then((r) => r.data)
}

/**
 * GET /pembayaran?rfid=xxx
 * Cari siswa lewat UID kartu RFID
 *
 * @param {string} uid
 * @returns {Promise<Object>}
 */
export function getSiswaByRfid(uid) {
    return api.get('/pembayaran', { params: { rfid: uid } }).then((r) => r.data)
}

/**
 * POST /pembayaran
 * Simpan transaksi pembayaran
 *
 * Body yang dikirim:
 * {
 *   riwayat_kelas_id: number,
 *   items: [
 *     { jenis_spp_id: number, bulan: string, nominal: number }
 *   ],
 *   metode_bayar: 'tunai' | 'transfer' | 'qris' | 'debit',
 *   bukti_transfer?: File (base64 string),
 *   catatan?: string
 * }
 *
 * @param {Object} payload
 * @returns {Promise<{data: Object, message: string}>}
 */
export function storePembayaran(payload) {
    return api.post('/pembayaran', payload).then((r) => r.data)
}

/**
 * GET /pembayaran/rekap
 * Rekap harian untuk admin (jika route tersedia)
 *
 * @param {string} tanggal - format YYYY-MM-DD
 * @returns {Promise<Object>}
 */
export function getRekapHarian(tanggal) {
    return api.get('/pembayaran/rekap', { params: { tanggal } }).then((r) => r.data)
}