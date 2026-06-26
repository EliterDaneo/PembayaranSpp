<template>
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 gap-5 font-sans sm:p-6">
        <!-- Header -->
        <div class="w-full max-w-lg flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="text-3xl">🏫</div>
                <div>
                    <h1 class="text-white font-bold text-lg leading-tight">SMK Mutu WSB</h1>
                    <p class="text-slate-400 text-xs">Sistem Pembayaran Sekolah</p>
                </div>
            </div>
            <div class="text-cyan-400 font-mono text-lg tracking-wider">{{ waktu }}</div>
        </div>

        <!-- Main Card -->
        <div
            class="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">

            <!-- RFID Zone -->
            <div @click="toggleRfid" :class="[
                'border-2 border-dashed rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 select-none',
                rfidMode ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/30' :
                    tapFlash ? 'border-cyan-400 bg-cyan-500/20' :
                        'border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/5'
            ]">
                <div class="text-3xl">{{ rfidMode ? '📡' : '💳' }}</div>
                <div>
                    <p v-if="rfidMode" class="text-white font-semibold">
                        Menunggu kartu RFID...
                        <span class="inline-block animate-pulse ml-1">🟢</span>
                    </p>
                    <p v-else class="text-white font-semibold">Tap Kartu RFID</p>
                    <p class="text-slate-400 text-xs mt-0.5">
                        {{ rfidMode ? 'Mode scan aktif - silakan tap kartu' : 'Klik area ini untuk mengaktifkan mode scan' }}
                    </p>
                </div>
            </div>

            <!-- RFID Status Indicator -->
            <div v-if="rfidMode" class="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <p class="text-cyan-400 text-xs font-medium">Mode RFID Aktif</p>
                </div>
                <p class="text-slate-500 text-xs mt-1">
                    • Tap kartu siswa pada reader<br />
                    • Mode akan tetap aktif sampai diklik ulang<br />
                    • Input manual dinonaktifkan
                </p>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-3 text-slate-500 text-xs">
                <div class="flex-1 h-px bg-white/10"></div>
                <span>atau cari manual</span>
                <div class="flex-1 h-px bg-white/10"></div>
            </div>

            <!-- Search -->
            <div class="flex gap-2">
                <div class="flex-1 relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {{ rfidMode ? '🔒' : '🔍' }}
                    </span>
                    <input ref="inputRef" v-model="query" type="text"
                        :placeholder="rfidMode ? 'Input manual dinonaktifkan - Gunakan RFID' : 'Ketik NIS atau Nama Siswa...'"
                        @keydown.enter="cariManual" @input="onInput" :disabled="loading || rfidMode || isProcessing"
                        autocomplete="off" :class="[
                            'w-full pl-10 pr-10 py-3 border rounded-xl text-sm transition-colors',
                            rfidMode
                                ? 'bg-slate-800/30 border-slate-700/50 text-slate-500 placeholder-slate-600 cursor-not-allowed'
                                : 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400'
                        ]" />
                    <button v-if="query && !rfidMode && !isProcessing" @click="resetForm"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        ✕
                    </button>
                    <!-- Lock icon saat RFID mode -->
                    <div v-if="rfidMode" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        🔒
                    </div>
                </div>
                <button @click="cariManual" :disabled="loading || !query.trim() || rfidMode || isProcessing" :class="[
                    'px-6 py-3 font-semibold rounded-xl transition-all',
                    rfidMode || isProcessing
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                ]">
                    <span v-if="loading" class="inline-block animate-spin">⟳</span>
                    <span v-else>Cari</span>
                </button>
            </div>

            <!-- Info saat RFID mode -->
            <div v-if="rfidMode" class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
                <p class="text-slate-500 text-xs text-center">
                    🔒 Input NIS/Nama dinonaktifkan saat mode RFID aktif
                </p>
            </div>

            <!-- Error Message -->
            <Transition name="fade">
                <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    ⚠️ {{ error }}
                </div>
            </Transition>

            <!-- Processing Indicator -->
            <Transition name="fade">
                <div v-if="isProcessing" class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                    <div class="inline-block animate-spin text-amber-400 mb-1">⟳</div>
                    <p class="text-amber-400 text-sm font-medium">Memproses data...</p>
                    <p class="text-slate-400 text-xs mt-1">Harap tunggu sebentar</p>
                </div>
            </Transition>

            <!-- Hasil Pencarian -->
            <Transition name="slide-up">
                <div v-if="siswa && !isProcessing"
                    class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl overflow-hidden">
                    <div class="p-4 flex gap-4 items-start">
                        <div
                            class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                            {{ inisial }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h2 class="text-white font-semibold text-base">{{ siswa.nama }}</h2>
                            <div class="flex flex-wrap gap-1.5 mt-2">
                                <span class="bg-white/10 text-slate-300 px-2 py-0.5 rounded-md text-xs font-mono">NIS:
                                    {{ siswa.nis }}</span>
                                <span class="bg-white/10 text-slate-300 px-2 py-0.5 rounded-md text-xs">{{ siswa.kelas
                                    }}</span>
                                <span class="bg-white/10 text-slate-300 px-2 py-0.5 rounded-md text-xs">{{
                                    siswa.tahun_ajaran }}</span>
                            </div>

                            <!-- Tagihan -->
                            <div v-if="siswa.tagihan?.length" class="mt-3">
                                <p class="text-slate-500 text-xs uppercase tracking-wider mb-2">Tagihan Aktif</p>
                                <div class="space-y-2">
                                    <div v-for="t in siswa.tagihan" :key="t.id"
                                        class="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                                        <span class="text-slate-300 text-sm">{{ t.nama }}</span>
                                        <span class="text-amber-400 font-mono text-sm font-semibold">Rp {{
                                            formatRp(t.nominal) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="mt-3 text-emerald-400 text-sm">✅ Semua tagihan lunas</div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="bg-black/20 px-4 py-3 border-t border-white/5 flex items-center justify-between">
                        <p class="text-slate-500 text-xs">
                            {{ antrianMessage ? '✅ ' + antrianMessage : 'Data dikirim ke bendahara' }}
                        </p>
                        <span class="text-emerald-400 text-xs font-medium">✓ Tersimpan</span>
                    </div>
                </div>
            </Transition>

            <!-- Success Message -->
            <Transition name="fade">
                <div v-if="showSuccess"
                    class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                    <p class="text-emerald-400 font-medium">✅ Siswa berhasil masuk antrian!</p>
                    <p class="text-slate-400 text-sm mt-1">
                        {{ rfidMode ? 'Silakan tap kartu berikutnya' : 'Silakan cari siswa berikutnya atau tap kartu lain' }}
                    </p>
                </div>
            </Transition>
        </div>

        <!-- Footer -->
        <p class="text-slate-600 text-xs">Hubungi bendahara jika ada masalah · v1.0</p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '../composables/useApi.js'
const { cariSiswa, cariRFID } = useApi()

// State
const query = ref('')
const siswa = ref(null)
const loading = ref(false)
const error = ref('')
const rfidMode = ref(false)
const tapFlash = ref(false)
const inputRef = ref(null)
const waktu = ref('')
const showSuccess = ref(false)
const antrianMessage = ref('')
const isProcessing = ref(false)
const emit = defineEmits(['siswa-ditemukan', 'rfid-status'])

// Clock
let clockTimer = null
function updateWaktu() {
    waktu.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Computed
const inisial = computed(() => {
    if (!siswa.value?.nama) return '?'
    const nama = String(siswa.value.nama || '')
    return nama.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

// Methods
function formatRp(n) {
    return Number(n || 0).toLocaleString('id-ID')
}

function resetForm() {
    query.value = ''
    siswa.value = null
    error.value = ''
    showSuccess.value = false
    antrianMessage.value = ''
    isProcessing.value = false
    if (!rfidMode.value) {
        inputRef.value?.focus()
    }
}

let debounceTimer = null
function onInput() {
    if (rfidMode.value || isProcessing.value) return // Jangan proses input saat RFID mode aktif
    error.value = ''
    siswa.value = null
    showSuccess.value = false
    clearTimeout(debounceTimer)
    if (query.value.trim().length >= 3) {
        debounceTimer = setTimeout(cariManual, 600)
    }
}

// Cari manual via input
async function cariManual() {
    if (!query.value.trim() || rfidMode.value || isProcessing.value) return

    await performSearch(query.value.trim())
}

// Cari via RFID
async function processRfid(code) {
    if (isProcessing.value) return // Cegah double processing

    tapFlash.value = true

    try {
        const res = await cariRFID(code)
        const data = res.data || (Array.isArray(res) ? res[0] : null)

        if (!data) throw new Error('Kartu tidak dikenali')

        // Tambahkan data ke antrian
        await addToQueue(data)

        // Reset tap flash
        setTimeout(() => {
            tapFlash.value = false
        }, 500)

    } catch (e) {
        error.value = e.message || 'Terjadi kesalahan'
        tapFlash.value = false
        // Error tidak menghentikan RFID mode
    }
}

// Fungsi utama untuk mencari dan menambahkan ke antrian
async function performSearch(searchValue) {
    if (isProcessing.value) return

    loading.value = true
    error.value = ''
    siswa.value = null
    showSuccess.value = false
    isProcessing.value = true

    try {
        const res = await cariSiswa(searchValue)
        const data = res.data || (Array.isArray(res) ? res[0] : null)

        if (!data) throw new Error('Siswa tidak ditemukan')

        await addToQueue(data)

    } catch (e) {
        error.value = e.message || 'Terjadi kesalahan'
    } finally {
        loading.value = false
        isProcessing.value = false
    }
}

// Tambahkan siswa ke antrian
async function addToQueue(data) {
    siswa.value = data

    // Kirim ke antrian admin
    emit('siswa-ditemukan', data)
    antrianMessage.value = `${data.nama} masuk antrian bendahara`

    // Tampilkan success
    showSuccess.value = true

    // Reset form setelah delay
    setTimeout(() => {
        if (rfidMode.value) {
            // Jika RFID mode aktif, hanya reset tampilan tapi tetap dalam mode RFID
            siswa.value = null
            error.value = ''
            showSuccess.value = false
            antrianMessage.value = ''
            isProcessing.value = false
        } else {
            // Jika mode manual, reset semua
            resetForm()
        }
    }, 2500)
}

// RFID Toggle
function toggleRfid() {
    if (isProcessing.value) return

    rfidMode.value = !rfidMode.value

    // Emit status RFID ke parent
    emit('rfid-status', rfidMode.value)

    if (rfidMode.value) {
        resetForm()
        showSuccess.value = false
        query.value = ''
    } else {
        tapFlash.value = false
        rfidBuf = ''
        clearTimeout(rfidTimer)
        resetForm()
        setTimeout(() => inputRef.value?.focus(), 100)
    }
}

// RFID Keyboard Handler
let rfidBuf = ''
let rfidTimer = null

function handleKeydown(e) {
    if (!rfidMode.value || isProcessing.value) return

    if (e.key === 'Enter') {
        if (rfidBuf.length >= 4) {
            processRfid(rfidBuf)
        }
        rfidBuf = ''
        clearTimeout(rfidTimer)
        return
    }

    if (e.key.length === 1) {
        rfidBuf += e.key
        clearTimeout(rfidTimer)
        rfidTimer = setTimeout(() => { rfidBuf = '' }, 300)
    }
}

// Lifecycle
onMounted(() => {
    updateWaktu()
    clockTimer = setInterval(updateWaktu, 1000)
    window.addEventListener('keydown', handleKeydown)
    setTimeout(() => inputRef.value?.focus(), 300)
})

onUnmounted(() => {
    clearInterval(clockTimer)
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>