<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans">
    <div class="flex min-h-screen flex-col">
      <!-- Header -->
      <header class="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl">💰</span>
            <div>
              <h1 class="font-mono text-sm font-bold tracking-wider text-cyan-400">SPP Pay</h1>
              <p class="text-[11px] text-slate-500">Sistem Pembayaran Sekolah</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- RFID Status Indicator -->
            <div v-if="isRfidActive"
              class="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5">
              <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-cyan-400 font-medium">RFID Mode Aktif</span>
              <span class="text-[10px] text-slate-500">- Password Otomatis</span>
            </div>

            <!-- Fullscreen Button -->
            <button @click="toggleFullscreen"
              class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
              title="Toggle Fullscreen (Ctrl+E)">
              <span>{{ isFullscreen ? '🗗' : '🗖' }}</span>
              <span class="text-[10px] text-slate-600">Ctrl+E</span>
            </button>

            <div class="h-5 w-px bg-white/10"></div>

            <!-- Layout Switcher -->
            <div class="flex gap-1">
              <button @click="layout = 'split'" :class="[
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                layout === 'split'
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300'
              ]">
                ⊞ Split
              </button>
              <button @click="layout = 'student-only'" :class="[
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                layout === 'student-only'
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300'
              ]">
                👤 Siswa
              </button>
              <button @click="layout = 'admin-only'" :class="[
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                layout === 'admin-only'
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300'
              ]">
                🏦 Bendahara
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <!-- Student Panel -->
        <section v-show="layout === 'split' || layout === 'student-only'" :class="[
          'overflow-y-auto border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10',
          layout === 'split' ? 'w-full lg:w-[440px] lg:flex-shrink-0' : 'w-full flex-1'
        ]">
          <StudentView @siswa-ditemukan="terimaData" @rfid-status="handleRfidStatus" />
        </section>

        <!-- Divider -->
        <div v-if="layout === 'split'" class="h-px w-full bg-white/10 lg:h-full lg:w-px"></div>

        <!-- Admin Panel -->
        <section v-show="layout === 'split' || layout === 'admin-only'" class="flex-1 overflow-y-auto">
          <AdminView ref="adminRef" :rfid-active="isRfidActive" />
        </section>
      </main>

      <!-- Fullscreen Hint Toast -->
      <Transition name="toast">
        <div v-if="showFullscreenHint"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
          <p class="text-sm text-slate-300 flex items-center gap-2">
            <span class="text-cyan-400">{{ isFullscreen ? '🗗' : '🗖' }}</span>
            {{ isFullscreen ? 'Tekan Ctrl+E untuk keluar fullscreen' : 'Tekan Ctrl+E untuk masuk fullscreen' }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import StudentView from '@/components/StudentView.vue'
import AdminView from '@/components/AdminView.vue'

const layout = ref('split')
const adminRef = ref(null)
const isFullscreen = ref(false)
const showFullscreenHint = ref(false)
const isRfidActive = ref(false)
let hintTimer = null

function terimaData(siswa) {
  adminRef.value?.tambahAntrian(siswa)
}

function handleRfidStatus(status) {
  isRfidActive.value = status
  // Teruskan status RFID ke AdminView
  if (adminRef.value) {
    adminRef.value.setRfidMode(status)
  }
}

// Fullscreen Functions
function enterFullscreen() {
  const el = document.documentElement
  if (el.requestFullscreen) {
    el.requestFullscreen().catch(() => {
      console.log('Auto-fullscreen tidak diizinkan, gunakan Ctrl+E')
    })
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
  showHint()
}

function showHint() {
  showFullscreenHint.value = true
  clearTimeout(hintTimer)
  hintTimer = setTimeout(() => {
    showFullscreenHint.value = false
  }, 3000)
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function handleGlobalKeydown(event) {
  if (event.ctrlKey && event.key.toLowerCase() === 'e') {
    event.preventDefault()
    toggleFullscreen()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)

  setTimeout(() => {
    if (!document.fullscreenElement) {
      enterFullscreen()
    }
    isFullscreen.value = !!document.fullscreenElement
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  clearTimeout(hintTimer)
})
</script>