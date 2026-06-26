<template>
    <div class="tagihan-form">
        <!-- Header siswa -->
        <div class="form-header">
            <BaseAvatar :nama="siswa.nama" :size="42" />
            <div class="form-header-info">
                <div class="form-nama">{{ siswa.nama }}</div>
                <div class="form-meta">{{ siswa.nis }} · {{ siswa.kelas }}</div>
            </div>
            <button class="btn-tutup" @click="$emit('tutup')" title="Tutup">✕</button>
        </div>

        <div class="form-body">
            <!-- Tagihan -->
            <div class="section-label">
                Tagihan
                <div class="select-all">
                    <button class="link-btn" @click="transaksiStore.checkAll()">Semua</button>
                    <span class="sep">·</span>
                    <button class="link-btn" @click="transaksiStore.uncheckAll()">Hapus</button>
                </div>
            </div>

            <div class="tagihan-list">
                <div v-for="(item, i) in transaksiStore.itemDipilih" :key="i" class="tagihan-row"
                    :class="{ checked: item.checked }" @click="transaksiStore.toggleItem(i)">
                    <input type="checkbox" :checked="item.checked" @change="transaksiStore.toggleItem(i)" @click.stop
                        class="tagihan-check" />
                    <div class="tagihan-info">
                        <div class="tagihan-jenis">{{ item.jenis }}</div>
                        <div class="tagihan-bulan">{{ item.bulan }}</div>
                    </div>
                    <div class="tagihan-nominal">{{ formatRp(item.nominal) }}</div>
                </div>

                <div v-if="!transaksiStore.itemDipilih.length" class="no-tagihan">
                    🎉 Tidak ada tagihan tertunggak
                </div>
            </div>

            <!-- Ringkasan total -->
            <div class="summary-box">
                <div class="summary-row">
                    <span>Item dipilih</span>
                    <span>{{ transaksiStore.jumlahDipilih }} / {{ transaksiStore.itemDipilih.length }}</span>
                </div>
                <div class="summary-row total">
                    <span>Total Pembayaran</span>
                    <span>{{ formatRp(transaksiStore.totalDibayar) }}</span>
                </div>
            </div>

            <!-- Metode Bayar -->
            <div class="section-label" style="margin-top: 1rem;">Metode Pembayaran</div>
            <div class="metode-grid">
                <button v-for="m in metodeOptions" :key="m.value" class="metode-btn"
                    :class="{ selected: transaksiStore.metodeBayar === m.value }"
                    @click="transaksiStore.metodeBayar = m.value">
                    <span class="metode-icon">{{ m.icon }}</span>
                    <span class="metode-label">{{ m.label }}</span>
                </button>
            </div>

            <!-- Upload bukti (jika transfer) -->
            <Transition name="fade">
                <div v-if="transaksiStore.metodeBayar === 'transfer'" class="bukti-upload">
                    <label class="upload-label">Bukti Transfer (opsional)</label>
                    <input type="file" accept="image/*" class="upload-input" @change="handleBukti" />
                </div>
            </Transition>

            <!-- Catatan -->
            <div class="catatan-group">
                <label class="section-label">Catatan (opsional)</label>
                <textarea class="catatan-input" v-model="transaksiStore.catatan" placeholder="Catatan tambahan…"
                    rows="2"></textarea>
            </div>

            <!-- Error -->
            <Transition name="fade">
                <div v-if="transaksiStore.error" class="error-msg">
                    ⚠ {{ transaksiStore.error }}
                </div>
            </Transition>

            <!-- Tombol proses -->
            <button class="btn-proses" :disabled="!transaksiStore.siapDiproses || transaksiStore.loading"
                @click="$emit('proses')">
                <BaseSpinner v-if="transaksiStore.loading" :size="18" />
                <span v-else>
                    Proses Pembayaran {{ transaksiStore.jumlahDipilih ? formatRp(transaksiStore.totalDibayar) : '' }} →
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useTransaksiStore } from '../../stores/transaksi.js'
import BaseAvatar from '../shared/BaseAvatar.vue'
import BaseSpinner from '../shared/BaseSpinner.vue'
import { formatRp } from '../../utils/format.js'

defineProps({
    siswa: { type: Object, required: true },
})

defineEmits(['proses', 'tutup'])

const transaksiStore = useTransaksiStore()

const metodeOptions = [
    { value: 'tunai', label: 'Tunai', icon: '💵' },
    { value: 'transfer', label: 'Transfer', icon: '🏦' },
    { value: 'qris', label: 'QRIS', icon: '📱' },
    { value: 'debit', label: 'Debit', icon: '💳' },
]

function handleBukti(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
        transaksiStore.buktiTransfer = ev.target.result
    }
    reader.readAsDataURL(file)
}
</script>

<style scoped>
.tagihan-form {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: var(--radius);
    border: 1px solid var(--gray-200);
    overflow: hidden;
}

.form-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 1.25rem;
    background: var(--blue-dark);
    color: white;
}

.form-header-info {
    flex: 1;
    min-width: 0;
}

.form-nama {
    font-size: 15px;
    font-weight: 700;
}

.form-meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);
    margin-top: 2px;
}

.btn-tutup {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    flex-shrink: 0;
}

.btn-tutup:hover {
    background: rgba(255, 255, 255, 0.25);
}

.form-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    max-height: calc(100vh - 240px);
}

.section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--gray-400);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.select-all {
    display: flex;
    gap: 4px;
    align-items: center;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 500;
}

.link-btn {
    background: none;
    border: none;
    color: var(--blue-accent);
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    font-family: inherit;
}

.sep {
    color: var(--gray-400);
    font-size: 12px;
}

.tagihan-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.tagihan-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.12s;
}

.tagihan-row:hover {
    background: var(--gray-100);
}

.tagihan-row.checked {
    background: var(--blue-light);
    border-color: rgba(43, 127, 212, 0.35);
}

.tagihan-check {
    width: 18px;
    height: 18px;
    accent-color: var(--blue-accent);
    flex-shrink: 0;
    cursor: pointer;
}

.tagihan-info {
    flex: 1;
}

.tagihan-jenis {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-900);
}

.tagihan-bulan {
    font-size: 11px;
    color: var(--gray-600);
    margin-top: 1px;
}

.tagihan-nominal {
    font-size: 13px;
    font-weight: 700;
    color: var(--blue-dark);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.no-tagihan {
    text-align: center;
    padding: 1.5rem;
    color: var(--teal);
    font-size: 14px;
    font-weight: 600;
}

.summary-box {
    background: var(--gray-100);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--gray-600);
}

.summary-row.total {
    font-size: 16px;
    font-weight: 700;
    color: var(--blue-dark);
    padding-top: 8px;
    margin-top: 4px;
    border-top: 1px solid var(--gray-200);
}

.metode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.metode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px;
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
}

.metode-btn:hover {
    border-color: var(--blue-accent);
}

.metode-btn.selected {
    border-color: var(--blue-accent);
    background: var(--blue-light);
}

.metode-icon {
    font-size: 22px;
}

.metode-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-700);
}

.metode-btn.selected .metode-label {
    color: var(--blue-mid);
}

.bukti-upload {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.upload-label {
    font-size: 12px;
    color: var(--gray-600);
}

.upload-input {
    font-size: 13px;
    font-family: inherit;
}

.catatan-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.catatan-input {
    width: 100%;
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    outline: none;
    color: var(--gray-900);
    transition: border-color 0.15s;
}

.catatan-input:focus {
    border-color: var(--blue-accent);
}

.error-msg {
    background: var(--red-light);
    color: var(--red);
    font-size: 13px;
    padding: 8px 12px;
    border-radius: 8px;
}

.btn-proses {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px;
    background: var(--teal);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    margin-top: 0.5rem;
}

.btn-proses:hover:not(:disabled) {
    background: #0a8562;
}

.btn-proses:disabled {
    background: var(--gray-200);
    color: var(--gray-400);
    cursor: not-allowed;
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