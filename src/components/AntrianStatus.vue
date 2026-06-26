<template>
    <Transition name="fade">
        <div v-if="status !== 'idle'" class="status-banner" :class="statusClass">
            <span class="status-icon">{{ statusIcon }}</span>
            <div class="status-body">
                <div class="status-title">{{ statusTitle }}</div>
                <div class="status-sub">{{ statusSub }}</div>
            </div>
            <button v-if="status === 'sent' || status === 'duplicate'" class="reset-btn" @click="$emit('reset')">
                ← Siswa baru
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        default: 'idle',
        // idle | found | sending | sent | duplicate | error
    },
    namaSiswa: { type: String, default: '' },
})

defineEmits(['reset'])

const statusClass = computed(() => ({
    'status-found': props.status === 'found',
    'status-sending': props.status === 'sending',
    'status-sent': props.status === 'sent',
    'status-duplicate': props.status === 'duplicate',
    'status-error': props.status === 'error',
}))

const statusIcon = computed(() => {
    const map = { found: '✓', sending: '⏳', sent: '📤', duplicate: '⚠', error: '✗' }
    return map[props.status] || ''
})

const statusTitle = computed(() => {
    const map = {
        found: 'Siswa ditemukan',
        sending: 'Mengirim data…',
        sent: `Data ${props.namaSiswa} terkirim!`,
        duplicate: 'Siswa sudah dalam antrian',
        error: 'Terjadi kesalahan',
    }
    return map[props.status] || ''
})

const statusSub = computed(() => {
    const map = {
        found: 'Klik "Kirim ke Bendahara" untuk lanjut',
        sending: 'Harap tunggu sebentar…',
        sent: 'Silakan menunggu giliran pembayaran',
        duplicate: 'Tunggu bendahara menyelesaikan pembayaran Anda',
        error: 'Coba lagi atau hubungi bendahara',
    }
    return map[props.status] || ''
})
</script>

<style scoped>
.status-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius);
    font-size: 13px;
}

.status-icon {
    font-size: 20px;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
}

.status-body {
    flex: 1;
}

.status-title {
    font-weight: 700;
    line-height: 1.3;
}

.status-sub {
    opacity: 0.8;
    font-size: 12px;
    margin-top: 2px;
}

.status-found {
    background: var(--teal-light);
    color: #074d38;
}

.status-sending {
    background: var(--amber-light);
    color: #7a4c00;
}

.status-sent {
    background: var(--teal-light);
    color: #074d38;
}

.status-duplicate {
    background: var(--amber-light);
    color: #7a4c00;
}

.status-error {
    background: var(--red-light);
    color: var(--red);
}

.reset-btn {
    background: rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    white-space: nowrap;
    transition: background 0.15s;
}

.reset-btn:hover {
    background: rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>