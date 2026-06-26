import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storePembayaran } from '../api/pembayaran.js'
import { useAntrianStore } from './antrian.js'

export const useTransaksiStore = defineStore('transaksi', () => {
    /** Item tagihan yang dipilih dalam form transaksi */
    const itemDipilih = ref([])
    const metodeBayar = ref('')
    const catatan = ref('')
    const buktiTransfer = ref(null)

    const loading = ref(false)
    const error = ref('')

    /** Riwayat transaksi sukses (dalam satu sesi) */
    const riwayat = ref([])

    const lastTransaksi = ref(null)

    const totalDibayar = computed(() =>
        itemDipilih.value
            .filter((i) => i.checked)
            .reduce((sum, i) => sum + Number(i.nominal), 0)
    )

    const jumlahDipilih = computed(
        () => itemDipilih.value.filter((i) => i.checked).length
    )

    const siapDiproses = computed(
        () => jumlahDipilih.value > 0 && metodeBayar.value !== ''
    )

    /**
     * Inisialisasi item dari tagihan siswa yang dipilih
     * @param {Array} tagihan
     */
    function initTagihan(tagihan) {
        itemDipilih.value = tagihan.map((t) => ({ ...t, checked: true }))
        metodeBayar.value = ''
        catatan.value = ''
        buktiTransfer.value = null
        error.value = ''
    }

    function toggleItem(index) {
        if (itemDipilih.value[index]) {
            itemDipilih.value[index].checked = !itemDipilih.value[index].checked
        }
    }

    function checkAll() {
        itemDipilih.value.forEach((i) => (i.checked = true))
    }

    function uncheckAll() {
        itemDipilih.value.forEach((i) => (i.checked = false))
    }

    async function proses(antrianItem) {
        if (!siapDiproses.value) return

        const antrianStore = useAntrianStore()
        loading.value = true
        error.value = ''

        const payload = {
            riwayat_kelas_id: antrianItem.riwayat_kelas_id,
            items: itemDipilih.value
                .filter((i) => i.checked)
                .map((i) => ({
                    jenis_spp_id: i.jenis_spp_id,
                    bulan: i.bulan,
                    nominal: i.nominal,
                })),
            metode_bayar: metodeBayar.value,
            catatan: catatan.value,
            ...(buktiTransfer.value ? { bukti_transfer: buktiTransfer.value } : {}),
        }

        try {
            // Uncomment untuk pakai API nyata:
            // const result = await storePembayaran(payload)

            // ─── Simulasi API ───
            await new Promise((r) => setTimeout(r, 900))
            const noKwitansi = `KWT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`
            const result = {
                data: {
                    no_kwitansi: noKwitansi,
                    nis: antrianItem.nis,
                    nama: antrianItem.nama,
                    kelas: antrianItem.kelas,
                    total: totalDibayar.value,
                    metode_bayar: metodeBayar.value,
                    items: payload.items,
                    created_at: new Date().toISOString(),
                },
                message: 'Pembayaran berhasil disimpan',
            }
            // ─── End simulasi ───

            const transaksi = {
                ...result.data,
                id: Date.now(),
                waktu: new Date().toLocaleString('id-ID'),
            }
            lastTransaksi.value = transaksi
            riwayat.value.unshift(transaksi)
            antrianStore.hapusAntrian(antrianItem.id)
            reset()
            return transaksi
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    function reset() {
        itemDipilih.value = []
        metodeBayar.value = ''
        catatan.value = ''
        buktiTransfer.value = null
        error.value = ''
    }

    return {
        itemDipilih, metodeBayar, catatan, buktiTransfer,
        loading, error, riwayat, lastTransaksi,
        totalDibayar, jumlahDipilih, siapDiproses,
        initTagihan, toggleItem, checkAll, uncheckAll, proses, reset,
    }
})