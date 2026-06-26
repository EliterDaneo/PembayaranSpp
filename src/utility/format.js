/**
 * Format angka ke Rupiah
 * @param {number} n
 * @returns {string}
 */
export function formatRp(n) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(n)
}

/**
 * Ambil inisial dari nama (maks 2 karakter)
 * @param {string} nama
 * @returns {string}
 */
export function inisial(nama = '') {
    return nama
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

/**
 * Generate warna konsisten berdasarkan string (untuk avatar)
 * @param {string} str
 * @returns {string} hex color
 */
export function stringToColor(str = '') {
    const colors = [
        '#1a4a7a', '#0d6e56', '#7a4c00', '#5a2d7a',
        '#8b1a1a', '#1a6b8a', '#5c6b1a', '#8b4a1a',
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

/**
 * Format tanggal ke string lokal
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTanggal(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

/**
 * Format waktu singkat
 * @param {string|Date} date
 * @returns {string}
 */
export function formatWaktu(date) {
    return new Date(date).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    })
}