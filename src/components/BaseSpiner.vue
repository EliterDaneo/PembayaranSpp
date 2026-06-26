<template>
    <span class="spinner" :style="{ width: size + 'px', height: size + 'px', borderWidth: borderW + 'px' }"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: { type: Number, default: 16 },
    color: { type: String, default: 'rgba(255,255,255,0.9)' },
})

const borderW = computed(() => Math.max(2, Math.round(props.size / 6)))
</script>

<style scoped>
.spinner {
    display: inline-block;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>