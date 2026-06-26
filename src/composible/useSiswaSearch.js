import { ref, watch } from 'vue'
import { useAntrianStore } from '../stores/antrian.js'
import { getSiswaByNis, getSiswaByRfid } from '../api/pembayaran.js'

// ─── Data dummy untuk dev — hapus saat pakai API nyata
const DUMMY_SISWA = [
    {
        nis: '2024001', nama: 'Ahmad Fauzi', kelas: 'XII RPL 1',
        riwayat_kelas_id: 101,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
            { jenis_spp_id: 2, jenis: 'SPP Praktikum', bulan: 'Juni 2025', nominal: 75000 },
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Mei 2025', nominal: 150000 },
        ],
    },
    {
        nis: '2024002', nama: 'Budi Santoso', kelas: 'XI TKJ 2',
        riwayat_kelas_id: 102,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
            { jenis_spp_id: 3, jenis: 'Uang Kegiatan', bulan: 'Semester 2', nominal: 200000 },
        ],
    },
    {
        nis: '2024003', nama: 'Citra Dewi', kelas: 'X MM 1',
        riwayat_kelas_id: 103,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
        ],
    },
    {
        nis: '2024004', nama: 'Dewi Rahayu', kelas: 'XII TKJ 1',
        riwayat_kelas_id: 104,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
            { jenis_spp_id: 2, jenis: 'SPP Praktikum', bulan: 'Juni 2025', nominal: 75000 },
            { jenis_spp_id: 4, jenis: 'Iuran Buku', bulan: 'TA 2024/2025', nominal: 120000 },
        ],
    },
    {
        nis: '2024005', nama: 'Eka Prasetya', kelas: 'XI RPL 2',
        riwayat_kelas_id: 105,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
        ],
    },
    {
        nis: '2024006', nama: 'Fina Amalia', kelas: 'X RPL 1',
        riwayat_kelas_id: 106,
        tagihan: [
            { jenis_spp_id: 1, jenis: 'SPP Pokok', bulan: 'Juni 2025', nominal: 150000 },
            { jenis_spp_id: 3, jenis: 'Uang Kegiatan', bulan: 'Semester 2', nominal: 200000 },
            { jenis_spp_id: 2, jenis: 'SPP Praktikum', bulan: 'Mei 2025', nominal: 75000 },
        ],
    },
]

function searchDummy(q) {
    const lower = q.toLowerCase().trim()
    return DUMMY_SISWA.find(
        (s) => s.nis.includes(lower) || s.nama.toLowerCase().includes(lower)
    ) ?? null
}

export function useSiswaSearch() {
    const antrianStore = useAntrianStore()

    const query = ref('')
    const siswaFound = ref(null)
    const searchLoading = ref(false)
    const searchError = ref('')
    const antrianStatus = ref('idle') // idle | found | sending | sent | duplicate | error

    let debounceTimer = null

    watch(query, (val) => {
        siswaFound.value = null
        searchError.value = ''
        antrianStatus.value = val.length >= 2 ? 'idle' : 'idle'
        clearTimeout(debounceTimer)
        if (val.trim().length < 2) return
        debounceTimer = setTimeout(() => cariSiswa(val), 350)
    })

    async function cariSiswa(q) {
        searchLoading.value = true
        searchError.value = ''
        try {
            // ─── Pakai API nyata:
            // const res = await getSiswaByNis(q.trim())
            // siswaFound.value = res.data

            // ─── Simulasi:
            await new Promise((r) => setTimeout(r, 300))
            const found = searchDummy(q)
            if (found) {
                siswaFound.value = found
                antrianStatus.value = 'found'
            } else {
                siswaFound.value = null
                searchError.value = 'Siswa tidak ditemukan'
                antrianStatus.value = 'idle'
            }
        } catch (err) {
            searchError.value = err.message
        } finally {
            searchLoading.value = false
        }
    }

    async function kirimKeAdmin() {
        if (!siswaFound.value) return
        antrianStatus.value = 'sending'
        await new Promise((r) => setTimeout(r, 500))
        const result = antrianStore.tambahAntrian(siswaFound.value)
        if (result.sudahAda) {
            antrianStatus.value = 'duplicate'
        } else {
            antrianStatus.value = 'sent'
        }
    }

    function reset() {
        query.value = ''
        siswaFound.value = null
        searchError.value = ''
        searchLoading.value = false
        antrianStatus.value = 'idle'
    }

    // ─── RFID
    const rfidScanning = ref(false)

    async function scanRfid(uid) {
        rfidScanning.value = true
        try {
            // Pakai API: const res = await getSiswaByRfid(uid)
            await new Promise((r) => setTimeout(r, 1400))
            const random = DUMMY_SISWA[Math.floor(Math.random() * DUMMY_SISWA.length)]
            siswaFound.value = random
            query.value = random.nis
            antrianStatus.value = 'found'
            await new Promise((r) => setTimeout(r, 400))
            await kirimKeAdmin()
        } catch (err) {
            searchError.value = err.message
        } finally {
            rfidScanning.value = false
        }
    }

    return {
        query, siswaFound, searchLoading, searchError, antrianStatus,
        rfidScanning,
        cariSiswa, kirimKeAdmin, scanRfid, reset,
    }
}