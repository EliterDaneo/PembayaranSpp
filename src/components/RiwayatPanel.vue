<template>
    <div class="riwayat-panel">
        <div class="riwayat-header">
            <span>Riwayat Hari Ini</span>
            <span class="riwayat-total">{{ formatRp(totalHariIni) }}</span>
        </div>

        <div v-if="!transaksiStore.riwayat.length" class="riwayat-empty">
            Belum ada transaksi
        </div>

        <div v-else class="riwayat-list">
            <div v-for="tx in transaksiStore.riwayat" :key="tx.id" class="riwayat-item">
                <div class="rx-left">
                    <div class="rx-name">{{ tx.nama }}</div>
                    <div class="rx-meta">{{ tx.no_kwitansi }} · {{ tx.metode_bayar?.toUpperCase() }}</div>
                </div>
                <div class="rx-right">
                    <div class="rx-amount">{{ formatRp(tx.total) }}</div>
                    <div class="rx-time">{{ tx.waktu?.split(' ').slice(-1)[0] || '' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransaksiStore } from '../../stores/transaksi.js'
import { formatRp } from '../../utils/format.js'

const transaksiStore = useTransaksiStore()

const totalHariIni = computed(() =>
    transaksiStore.riwayat.reduce((s, t) => s + t.total, 0)
)
</script>

<style scoped>
.riwayat-panel {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    overflow: hidden;
}

.riwayat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--gray-100);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--gray-600);
    border-bottom: 1px solid var(--gray-200);
}

.riwayat-total {
    font-size: 13px;
    font-weight: 700;
    color: var(--teal);
    text-transform: none;
    letter-spacing: 0;
}

.riwayat-empty {
    padding: 1rem;
    font-size: 13px;
    color: var(--gray-400);
    text-align: center;
}

.riwayat-list {
    display: flex;
    flex-direction: column;
}

.riwayat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 14px;
    border-bottom: 1px solid var(--gray-100);
    font-size: 13px;
}

.riwayat-item:last-child {
    border-bottom: none;
}

.rx-name {
    font-weight: 600;
}

.rx-meta {
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 2px;
}

.rx-right {
    text-align: right;
}

.rx-amount {
    font-weight: 700;
    color: var(--blue-dark);
    font-variant-numeric: tabular-nums;
}

.rx-time {
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 2px;
}
</style>