<template>
    <div class="panel-admin">
        <!-- Lock screen -->
        <AdminLock v-if="!authStore.isAdmin" />

        <!-- Panel aktif -->
        <template v-else>
            <div class="admin-layout">

                <!-- Sidebar kiri: daftar antrian -->
                <div class="admin-sidebar">
                    <AntrianList />

                    <!-- Riwayat harian -->
                    <div class="sidebar-footer">
                        <RiwayatPanel />
                    </div>
                </div>

                <!-- Konten kanan: form transaksi -->
                <div class="admin-main">
                    <Transition name="fade" mode="out-in">
                        <!-- Belum pilih antrian -->
                        <div v-if="!antrianStore.selected" key="empty" class="main-empty">
                            <div class="empty-icon">👆</div>
                            <div class="empty-title">Pilih siswa dari antrian</div>
                            <div class="empty-sub">Klik nama siswa di panel kiri untuk memulai transaksi</div>
                        </div>

                        <!-- Form transaksi -->
                        <div v-else key="form" class="main-form">
                            <TagihanForm :siswa="antrianStore.selected" @proses="prosesTransaksi"
                                @tutup="antrianStore.resetSelected" />
                        </div>
                    </Transition>
                </div>
            </div>

            <!-- Kwitansi modal -->
            <KwitansiModal :transaksi="transaksiStore.lastTransaksi" @tutup="transaksiStore.lastTransaksi = null" />
        </template>
    </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.js'
import { useAntrianStore } from '../stores/antrian.js'
import { useTransaksiStore } from '../stores/transaksi.js'

import AdminLock from '../components/admin/AdminLock.vue'
import AntrianList from '../components/admin/AntrianList.vue'
import TagihanForm from '../components/admin/TagihanForm.vue'
import KwitansiModal from '../components/admin/KwitansiModal.vue'
import RiwayatPanel from '../components/admin/RiwayatPanel.vue'

const authStore = useAuthStore()
const antrianStore = useAntrianStore()
const transaksiStore = useTransaksiStore()

async function prosesTransaksi() {
    if (!antrianStore.selected) return
    try {
        await transaksiStore.proses(antrianStore.selected)
        // KwitansiModal otomatis muncul karena lastTransaksi di-set di store
    } catch {
        // error sudah di-handle di store
    }
}
</script>

<style scoped>
.panel-admin {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--gray-100);
    overflow: hidden;
}

.admin-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.admin-sidebar {
    width: 300px;
    min-width: 260px;
    background: white;
    border-right: 1px solid var(--gray-200);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--gray-200);
    max-height: 240px;
    overflow-y: auto;
}

.admin-main {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
}

.main-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--gray-400);
    text-align: center;
    padding: 2rem;
}

.main-form {
    display: flex;
    flex-direction: column;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 14px;
}

.empty-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-600);
    margin-bottom: 8px;
}

.empty-sub {
    font-size: 13px;
    max-width: 240px;
    line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.18s, transform 0.18s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

@media (max-width: 900px) {
    .admin-sidebar {
        width: 240px;
        min-width: 200px;
    }
}
</style>