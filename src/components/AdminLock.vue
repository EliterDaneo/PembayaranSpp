<template>
    <div class="lock-screen">
        <div class="lock-card">
            <div class="lock-icon">🔒</div>
            <h2 class="lock-title">Panel Bendahara</h2>
            <p class="lock-sub">Masukkan password untuk mengakses antrian pembayaran</p>

            <div class="lock-form">
                <Transition name="fade">
                    <div v-if="authStore.loginError" class="error-box">
                        ⚠ {{ authStore.loginError }}
                    </div>
                </Transition>

                <div class="input-group">
                    <input ref="passRef" :type="showPass ? 'text' : 'password'" class="pass-input" v-model="password"
                        placeholder="Password bendahara" @keyup.enter="submit" autocomplete="current-password" />
                    <button class="toggle-pass" @click="showPass = !showPass" type="button">
                        {{ showPass ? '🙈' : '👁' }}
                    </button>
                </div>

                <button class="btn-submit" :disabled="!password || authStore.loginLoading" @click="submit">
                    <BaseSpinner v-if="authStore.loginLoading" :size="18" />
                    <span v-else>Masuk ke Panel Admin →</span>
                </button>
            </div>

            <p class="version">v{{ version }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import BaseSpinner from '../shared/BaseSpinner.vue'

const authStore = useAuthStore()
const password = ref('')
const showPass = ref(false)
const passRef = ref(null)
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'

onMounted(() => passRef.value?.focus())

async function submit() {
    if (!password.value || authStore.loginLoading) return
    try {
        await authStore.login(password.value)
        password.value = ''
    } catch {
        password.value = ''
        passRef.value?.focus()
    }
}
</script>

<style scoped>
.lock-screen {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--gray-100);
}

.lock-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 360px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.lock-icon {
    width: 64px;
    height: 64px;
    background: var(--blue-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 0.5rem;
}

.lock-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--blue-dark);
}

.lock-sub {
    font-size: 13px;
    color: var(--gray-600);
    line-height: 1.5;
    max-width: 260px;
}

.lock-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 0.5rem;
}

.error-box {
    background: var(--red-light);
    color: var(--red);
    font-size: 13px;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 500;
}

.input-group {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.input-group:focus-within {
    border-color: var(--blue-accent);
    box-shadow: 0 0 0 3px rgba(43, 127, 212, 0.12);
}

.pass-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 14px;
    font-size: 16px;
    font-family: inherit;
    text-align: center;
    letter-spacing: 0.1em;
    background: transparent;
    color: var(--gray-900);
}

.pass-input::placeholder {
    letter-spacing: 0;
    color: var(--gray-400);
}

.toggle-pass {
    padding: 0 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}

.btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: var(--blue-accent);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
}

.btn-submit:hover:not(:disabled) {
    background: #1f6ab7;
}

.btn-submit:disabled {
    background: var(--gray-200);
    color: var(--gray-400);
    cursor: not-allowed;
}

.version {
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 0.5rem;
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