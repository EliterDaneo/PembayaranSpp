import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSiswaByNis, getSiswaByRfid } from '../api/pembayaran.js'

let _antrianId = 1

export const useAntrianStore = defineStore('antrian', () => {
    /** @type {import('vue').Ref<AntrianItem[]>} */
    const antrian = ref([])
    const selectedId = ref(null)

    const selected = computed(() =>
        antrian.value.find((a) => a.id === selectedId.value) ?? null
    )

    const jumlahAntrian = computed(() => antrian.value.length)

    /**
     * Tambah siswa ke antrian setelah lookup ke API
     * @param {Object} siswaData - data dari response API
     */
    function tambahAntrian(siswaData) {
        const sudahAda = antrian.value.some(
            (a) => a.nis === siswaData.nis
        )
        if (sudahAda) return { sudahAda: true }

        const item = {
            id: _antrianId++,
            nis: siswaData.nis,
            nama: siswaData.nama,
            kelas: siswaData.kelas,
            riwayat_kelas_id: siswaData.riwayat_kelas_id,
            tagihan: siswaData.tagihan ?? [],
            waktuAntri: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
            timestampAntri: Date.now(),
        }
        antrian.value.push(item)
        return { sudahAda: false, item }
    }

    function pilihAntrian(id) {
        selectedId.value = id
    }

    function hapusAntrian(id) {
        antrian.value = antrian.value.filter((a) => a.id !== id)
        if (selectedId.value === id) selectedId.value = null
    }

    function resetSelected() {
        selectedId.value = null
    }

    return {
        antrian,
        selectedId,
        selected,
        jumlahAntrian,
        tambahAntrian,
        pilihAntrian,
        hapusAntrian,
        resetSelected,
    }
})