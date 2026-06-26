<template>
    <div class="avatar"
        :style="{ background: bgColor, width: size + 'px', height: size + 'px', fontSize: fontSize + 'px' }">
        {{ inisial(nama) }}
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { inisial, stringToColor } from '../../utils/format.js'

const props = defineProps({
    nama: { type: String, default: '' },
    size: { type: Number, default: 44 },
})

const fontSize = computed(() => Math.round(props.size * 0.35))
const bgColor = computed(() => stringToColor(props.nama))
</script>

<style scoped>
.avatar {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    line-height: 1;
}
</style>