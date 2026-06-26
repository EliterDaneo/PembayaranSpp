<template>
    <div class="rfid-wrap">
        <div class="rfid-card" :class="{ scanning, disabled }" @click="!scanning && !disabled && $emit('scan')"
            role="button" tabindex="0" @keyup.enter="!scanning && !disabled && $emit('scan')"
            :aria-label="scanning ? 'Mendeteksi kartu RFID' : 'Tempelkan kartu RFID'">
            <div class="rfid-icon">
                <Transition name="fade" mode="out-in">
                    <span v-if="scanning" key="scan">📡</span>
                    <span v-else key="idle">💳</span>
                </Transition>
            </div>

            <div class="rfid-content">
                <div class="rfid-title">
                    {{ scanning ? 'Mendeteksi kartu…' : 'Tempelkan Kartu RFID' }}
                </div>
                <div class="rfid-sub">
                    {{ scanning ? 'Harap tahan kartu di reader' : 'Atau klik untuk simulasi tap' }}
                </div>
            </div>

            <div v-if="scanning" class="rfid-pulse">
                <div class="pulse-ring"></div>
                <div class="pulse-ring delay"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    scanning: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
})

defineEmits(['scan'])
</script>

<style scoped>
.rfid-wrap {
    position: relative;
}

.rfid-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border: 2px dashed var(--blue-accent);
    border-radius: var(--radius);
    background: var(--blue-light);
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
    position: relative;
    overflow: hidden;
}

.rfid-card:hover:not(.scanning):not(.disabled) {
    background: #d4e9f7;
    border-style: solid;
}

.rfid-card.scanning {
    border-style: solid;
    border-color: var(--blue-accent);
    animation: pulse-bg 1.5s ease-in-out infinite;
}

.rfid-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@keyframes pulse-bg {

    0%,
    100% {
        background: var(--blue-light);
    }

    50% {
        background: #c6dfef;
    }
}

.rfid-icon {
    font-size: 28px;
    flex-shrink: 0;
    width: 40px;
    text-align: center;
}

.rfid-content {
    flex: 1;
}

.rfid-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--blue-dark);
}

.rfid-sub {
    font-size: 12px;
    color: var(--blue-accent);
    margin-top: 3px;
}

.rfid-pulse {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
}

.pulse-ring {
    width: 32px;
    height: 32px;
    border: 2px solid var(--blue-accent);
    border-radius: 50%;
    animation: ripple 1.5s linear infinite;
}

.pulse-ring.delay {
    position: absolute;
    top: 0;
    left: 0;
    animation-delay: 0.6s;
}

@keyframes ripple {
    from {
        transform: scale(0.5);
        opacity: 1;
    }

    to {
        transform: scale(1.8);
        opacity: 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>