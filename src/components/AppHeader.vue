<template>
    <header class="app-header">
        <div class="header-brand">
            <div class="logo-mark">S</div>
            <div class="brand-text">
                <span class="brand-name">{{ appName }}</span>
                <span class="brand-sub">Sistem Pembayaran SPP</span>
            </div>
        </div>

        <div class="header-center">
            <div class="status-badge" :class="isOnline ? 'online' : 'offline'">
                <span class="dot"></span>
                {{ isOnline ? 'Online' : 'Offline' }}
            </div>
        </div>

        <div class="header-right">
            <span class="header-clock">{{ clock }}</span>
            <button v-if="isAdmin" class="btn-logout" @click="$emit('logout')" title="Keluar dari panel admin">
                🔓 Keluar
            </button>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useClock } from '../../composables/useClock.js'

defineProps({
    isAdmin: { type: Boolean, default: false },
})

defineEmits(['logout'])

const { clock } = useClock()
const appName = import.meta.env.VITE_APP_NAME || 'SMK Mutu WSB'

const isOnline = ref(navigator.onLine)
const handleOnline = () => (isOnline.value = true)
const handleOffline = () => (isOnline.value = false)

onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
})
onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.app-header {
    background: var(--blue-dark);
    color: white;
    padding: 0 1.5rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-mark {
    width: 32px;
    height: 32px;
    background: var(--blue-accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
}

.brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.brand-name {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.brand-sub {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
}

.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
}

.status-badge.online {
    background: rgba(13, 158, 117, 0.25);
    color: #5de8be;
}

.status-badge.offline {
    background: rgba(192, 57, 43, 0.25);
    color: #f4a4a0;
}

.status-badge .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-clock {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.btn-logout {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.85);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
}

.btn-logout:hover {
    background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
    .header-clock {
        display: none;
    }

    .brand-sub {
        display: none;
    }
}
</style>