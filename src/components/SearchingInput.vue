<template>
    <div class="search-wrap">
        <label class="input-label">NIS atau Nama Siswa</label>
        <div class="input-row">
            <span class="icon">🔍</span>
            <input ref="inputRef" class="input-field" type="text" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" @keyup.enter="$emit('search')"
                placeholder="Ketik NIS atau nama lengkap…" autocomplete="off" spellcheck="false" />
            <BaseSpinner v-if="loading" :size="18" />
            <button v-else-if="modelValue.length > 0" class="clear-btn" @click="$emit('clear')" title="Hapus">✕</button>
        </div>

        <!-- Error message -->
        <p v-if="error" class="search-error">⚠ {{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseSpinner from '../shared/BaseSpinner.vue'

defineProps({
    modelValue: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'search', 'clear'])

const inputRef = ref(null)

onMounted(() => {
    inputRef.value?.focus()
})
</script>

<style scoped>
.search-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-600);
}

.input-row {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius);
    background: white;
    transition: border-color 0.15s, box-shadow 0.15s;
    overflow: hidden;
}

.input-row:focus-within {
    border-color: var(--blue-accent);
    box-shadow: 0 0 0 3px rgba(43, 127, 212, 0.12);
}

.icon {
    padding: 0 10px;
    font-size: 16px;
    color: var(--gray-400);
    flex-shrink: 0;
}

.input-field {
    flex: 1;
    border: none;
    outline: none;
    padding: 11px 0;
    font-size: 16px;
    font-family: inherit;
    color: var(--gray-900);
    background: transparent;
    min-width: 0;
}

.input-field::placeholder {
    color: var(--gray-400);
}

.clear-btn {
    padding: 0 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-400);
    font-size: 14px;
    transition: color 0.15s;
}

.clear-btn:hover {
    color: var(--gray-900);
}

.search-error {
    font-size: 12px;
    color: var(--red);
    padding: 6px 10px;
    background: var(--red-light);
    border-radius: 6px;
}
</style>