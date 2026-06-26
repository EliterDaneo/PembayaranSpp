<template>
    <div class="panel-siswa">
        <div class="panel-header">
            <div class="panel-label">Portal Siswa</div>
            <h1 class="panel-title">Pembayaran SPP</h1>
            <p class="panel-desc">Masukkan NIS atau nama, lalu kirim ke bendahara</p>
        </div>

        <div class="panel-body">
            <!-- Status antrian -->
            <AntrianStatus :status="antrianStatus" :nama-siswa="siswaFound?.nama" @reset="resetForm" />

            <!-- Form hanya muncul saat belum sent/duplicate -->
            <template v-if="!['sent', 'duplicate'].includes(antrianStatus)">
                <!-- Search input -->
                <SearchInput v-model="query" :loading="searchLoading" :error="searchError" @search="() => { }"
                    @clear="resetForm" />

                <!-- Preview siswa ditemukan -->
                <StudentCard :siswa="siswaFound" />

                <!-- Tombol kirim -->
                <button class="btn-kirim" :disabled="!siswaFound || ['sending'].includes(antrianStatus)"
                    @click="kirimKeAdmin">
                    <BaseSpinner v-if="antrianStatus === 'sending'" :size="18" />
                    <span v-else>Kirim ke Bendahara →</span>
                </button>

                <!-- Divider -->
                <div class="divider-or">
                    <span>atau tap kartu RFID</span>
                </div>

                <!-- RFID Scanner -->
                <RfidScanner :scanning="rfidScanning" :disabled="antrianStatus === 'sending'" @scan="scanRfid(null)" />
            </template>
        </div>

        <!-- Footer info -->
        <div class="panel-footer">
            <span>💡 Pastikan NIS Anda benar sebelum mengirim</span>
        </div>
    </div>
</template>

<script setup>
import { useSiswaSearch } from '../composables/useSiswaSearch.js'
import SearchInput from '../components/siswa/SearchInput.vue'
import StudentCard from '../components/siswa/StudentCard.vue'
import RfidScanner from '../components/siswa/RfidScanner.vue'
import AntrianStatus from '../components/siswa/AntrianStatus.vue'
import BaseSpinner from '../components/shared/BaseSpinner.vue'

const {
    query, siswaFound, searchLoading, searchError,
    antrianStatus, rfidScanning,
    kirimKeAdmin, scanRfid, reset: resetForm,
} = useSiswaSearch()
</script>

<style scoped>
.panel-siswa {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-right: 1px solid var(--gray-200);
}

.panel-header {
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid var(--gray-100);
}

.panel-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gray-400);
    margin-bottom: 4px;
}

.panel-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--blue-dark);
    margin: 0;
}

.panel-desc {
    font-size: 13px;
    color: var(--gray-600);
    margin-top: 4px;
}

.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.btn-kirim {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px;
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

.btn-kirim:hover:not(:disabled) {
    background: #1f6ab7;
}

.btn-kirim:active:not(:disabled) {
    transform: scale(0.99);
}

.btn-kirim:disabled {
    background: var(--gray-200);
    color: var(--gray-400);
    cursor: not-allowed;
}

.divider-or {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--gray-400);
    font-size: 12px;
    font-weight: 500;
}

.divider-or::before,
.divider-or::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-200);
}

.panel-footer {
    padding: 12px 2rem;
    border-top: 1px solid var(--gray-100);
    font-size: 12px;
    color: var(--gray-400);
    background: var(--gray-100);
}
</style>