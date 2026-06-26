<template>
    <Transition name="modal">
        <div v-if="transaksi" class="modal-overlay" @click.self="$emit('tutup')">
            <div class="modal-card">
                <div class="success-header">
                    <div class="success-icon">✅</div>
                    <div class="success-title">Pembayaran Berhasil!</div>
                    <div class="success-sub">Transaksi telah tercatat</div>
                </div>

                <div class="kwitansi-body">
                    <!-- Judul kwitansi -->
                    <div class="kwitansi-title">
                        <div class="school-name">{{ appName }}</div>
                        <div class="kwitansi-label">BUKTI PEMBAYARAN SPP</div>
                        <div class="no-kwitansi">No: {{ transaksi.no_kwitansi }}</div>
                    </div>

                    <div class="kwitansi-divider"></div>

                    <!-- Info siswa -->
                    <div class="kwitansi-section">
                        <div class="kwitansi-row">
                            <span class="k-label">Nama</span>
                            <span class="k-value">{{ transaksi.nama }}</span>
                        </div>
                        <div class="kwitansi-row">
                            <span class="k-label">NIS</span>
                            <span class="k-value">{{ transaksi.nis }}</span>
                        </div>
                        <div class="kwitansi-row">
                            <span class="k-label">Kelas</span>
                            <span class="k-value">{{ transaksi.kelas }}</span>
                        </div>
                    </div>

                    <div class="kwitansi-divider dashed"></div>

                    <!-- Rincian item -->
                    <div class="kwitansi-section">
                        <div class="k-label" style="margin-bottom: 6px;">Rincian Pembayaran</div>
                        <div v-for="(item, i) in transaksi.items" :key="i" class="item-row">
                            <div class="item-desc">
                                <span>{{ item.jenis || 'SPP' }}</span>
                                <span class="item-bulan">{{ item.bulan }}</span>
                            </div>
                            <span class="item-nominal">{{ formatRp(item.nominal) }}</span>
                        </div>
                    </div>

                    <div class="kwitansi-divider"></div>

                    <!-- Total -->
                    <div class="kwitansi-total">
                        <span>Total Dibayar</span>
                        <span class="total-amount">{{ formatRp(transaksi.total) }}</span>
                    </div>

                    <div class="kwitansi-section" style="margin-top: 8px;">
                        <div class="kwitansi-row">
                            <span class="k-label">Metode</span>
                            <span class="k-value">{{ transaksi.metode_bayar?.toUpperCase() }}</span>
                        </div>
                        <div class="kwitansi-row">
                            <span class="k-label">Waktu</span>
                            <span class="k-value">{{ transaksi.waktu }}</span>
                        </div>
                    </div>

                    <div class="kwitansi-footer">
                        Terima kasih atas pembayaran Anda
                    </div>
                </div>

                <!-- Tombol aksi -->
                <div class="modal-actions">
                    <button class="btn-print" @click="print">🖨 Cetak Kwitansi</button>
                    <button class="btn-close" @click="$emit('tutup')">Selesai & Lanjut →</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { formatRp } from '../../utils/format.js'

defineProps({
    transaksi: { type: Object, default: null },
})

defineEmits(['tutup'])

const appName = import.meta.env.VITE_APP_NAME || 'SMK Mutu WSB'

function print() {
    window.print()
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
}

.modal-card {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.success-header {
    background: var(--teal);
    color: white;
    text-align: center;
    padding: 1.5rem 1rem 1rem;
}

.success-icon {
    font-size: 40px;
    margin-bottom: 8px;
}

.success-title {
    font-size: 20px;
    font-weight: 700;
}

.success-sub {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 4px;
}

.kwitansi-body {
    padding: 1.25rem;
    overflow-y: auto;
    flex: 1;
}

.kwitansi-title {
    text-align: center;
    margin-bottom: 12px;
}

.school-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--blue-dark);
}

.kwitansi-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--gray-600);
    margin-top: 2px;
}

.no-kwitansi {
    font-size: 12px;
    color: var(--gray-600);
    margin-top: 4px;
    font-family: monospace;
}

.kwitansi-divider {
    height: 1px;
    background: var(--gray-200);
    margin: 12px 0;
}

.kwitansi-divider.dashed {
    background: none;
    border-top: 1.5px dashed var(--gray-200);
}

.kwitansi-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.kwitansi-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 13px;
}

.k-label {
    color: var(--gray-600);
}

.k-value {
    font-weight: 600;
    color: var(--gray-900);
    text-align: right;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    font-size: 13px;
}

.item-desc {
    display: flex;
    flex-direction: column;
}

.item-bulan {
    font-size: 11px;
    color: var(--gray-400);
}

.item-nominal {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.kwitansi-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: var(--blue-light);
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
}

.total-amount {
    font-size: 18px;
    color: var(--blue-dark);
}

.kwitansi-footer {
    text-align: center;
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 1rem;
    font-style: italic;
}

.modal-actions {
    display: flex;
    gap: 8px;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--gray-200);
}

.btn-print {
    flex: 1;
    padding: 11px;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius);
    background: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    color: var(--gray-700);
    transition: background 0.15s;
}

.btn-print:hover {
    background: var(--gray-100);
}

.btn-close {
    flex: 2;
    padding: 11px;
    background: var(--blue-accent);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
}

.btn-close:hover {
    background: #1f6ab7;
}

/* Transition */
.modal-enter-active {
    animation: modalIn 0.25s ease;
}

.modal-leave-active {
    animation: modalIn 0.2s ease reverse;
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.94) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@media print {
    .modal-overlay {
        position: static;
        background: none;
    }

    .modal-card {
        box-shadow: none;
        border: none;
        max-height: none;
    }

    .modal-actions {
        display: none;
    }

    .success-header {
        background: none;
        color: black;
    }
}
</style>