<template>
    <Transition name="slide-up">
        <div v-if="siswa" class="student-card">
            <BaseAvatar :nama="siswa.nama" :size="48" />
            <div class="student-info">
                <div class="student-name">{{ siswa.nama }}</div>
                <div class="student-detail">
                    <span class="nis-badge">{{ siswa.nis }}</span>
                    <span class="sep">·</span>
                    <span>{{ siswa.kelas }}</span>
                </div>
                <div class="tagihan-count" v-if="siswa.tagihan?.length">
                    {{ siswa.tagihan.length }} tagihan tertunggak
                </div>
            </div>
            <div class="found-badge">✓ Ditemukan</div>
        </div>
    </Transition>
</template>

<script setup>
import BaseAvatar from '../shared/BaseAvatar.vue'

defineProps({
    siswa: { type: Object, default: null },
})
</script>

<style scoped>
.student-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--blue-light);
    border: 1.5px solid rgba(43, 127, 212, 0.3);
    border-radius: var(--radius);
}

.student-info {
    flex: 1;
    min-width: 0;
}

.student-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--blue-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.student-detail {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--gray-600);
    margin-top: 3px;
}

.nis-badge {
    font-family: monospace;
    background: rgba(43, 127, 212, 0.12);
    color: var(--blue-mid);
    padding: 1px 7px;
    border-radius: 4px;
    font-size: 12px;
}

.sep {
    color: var(--gray-400);
}

.tagihan-count {
    font-size: 11px;
    color: var(--amber);
    font-weight: 600;
    margin-top: 4px;
}

.found-badge {
    font-size: 11px;
    font-weight: 700;
    color: var(--teal);
    background: var(--teal-light);
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
}

.slide-up-enter-active {
    animation: slideUp 0.2s ease;
}

.slide-up-leave-active {
    animation: slideUp 0.15s ease reverse;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>