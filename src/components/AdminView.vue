<template>
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <!-- Lock Screen -->
        <Transition name="fade">
            <div v-if="!unlocked"
                class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                    <div class="text-center mb-6">
                        <div class="text-5xl mb-3">🔐</div>
                        <h2 class="text-xl font-bold text-white">Akses Bendahara</h2>
                        <p class="text-sm text-slate-400 mt-1">Masukkan password untuk melanjutkan</p>
                    </div>

                    <div class="relative mb-4">
                        <input ref="passRef" v-model="passInput" :type="showPass ? 'text' : 'password'"
                            placeholder="Password..." @keydown.enter="unlock"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                        <button @click="showPass = !showPass"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                            {{ showPass ? '🙈' : '👁️' }}
                        </button>
                    </div>

                    <Transition name="fade">
                        <div v-if="lockError"
                            class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">
                            {{ lockError }}
                        </div>
                    </Transition>

                    <button @click="unlock" :disabled="!passInput"
                        class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all">
                        Masuk
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Main Admin Panel -->
        <template v-if="unlocked">
            <!-- Top Bar -->
            <header class="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
                <div class="px-4 lg:px-6 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">💰</span>
                        <div>
                            <h1 class="text-white font-semibold text-sm lg:text-base">Panel Bendahara</h1>
                            <p class="text-xs text-cyan-400 font-mono">{{ waktu }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button @click="refreshData"
                            class="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                            title="Refresh">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button @click="lockScreen"
                            class="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white text-sm transition-all">
                            🔒 Kunci
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Grid -->
            <div class="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                <!-- Left Panel: Student Queue -->
                <div
                    class="w-full lg:w-80 xl:w-96 bg-slate-800/30 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col h-full overflow-hidden">
                    <div class="p-4 border-b border-slate-700/50">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-white font-semibold text-sm">Antrian Siswa</h3>
                            <span class="bg-cyan-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {{ antrian.length }}
                            </span>
                        </div>

                        <!-- Search Input -->
                        <div class="relative">
                            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input v-model="searchQuery" type="text" placeholder="Cari nama atau NIS..."
                                @input="handleSearch"
                                class="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                            <!-- Clear button -->
                            <button v-if="searchQuery" @click="clearSearch"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        <!-- Search Results Info -->
                        <div v-if="searchQuery" class="mt-2 text-xs text-slate-400">
                            Menampilkan {{ filteredAntrian.length }} dari {{ antrian.length }} siswa
                        </div>
                    </div>

                    <!-- Queue List -->
                    <div class="flex-1 overflow-y-auto">
                        <!-- Empty State -->
                        <div v-if="antrian.length === 0"
                            class="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div class="text-4xl mb-4">📭</div>
                            <p class="text-slate-400 text-sm font-medium">Belum ada siswa masuk</p>
                            <p class="text-slate-500 text-xs mt-1">Data muncul otomatis saat siswa input</p>
                        </div>

                        <!-- No Search Results -->
                        <div v-else-if="searchQuery && filteredAntrian.length === 0"
                            class="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div class="text-4xl mb-4">🔍</div>
                            <p class="text-slate-400 text-sm font-medium">Siswa tidak ditemukan</p>
                            <p class="text-slate-500 text-xs mt-1">Coba kata kunci lain</p>
                        </div>

                        <!-- Queue Items -->
                        <div v-else class="p-2 space-y-1">
                            <div v-for="(s, index) in filteredAntrian" :key="s.id || s.nis || index"
                                @click="pilihSiswa(s)" :class="[
                                    'p-3 rounded-xl cursor-pointer transition-all duration-200 border',
                                    selected && selected.id === s.id
                                        ? 'bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                                        : 'border-transparent hover:bg-slate-700/30 hover:border-slate-600/30'
                                ]">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                                        {{ getInitials(s.nama) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-white text-sm font-medium truncate">{{ s.nama }}</p>
                                        <p class="text-slate-400 text-xs font-mono">NIS: {{ s.nis }}</p>
                                        <p v-if="s.kelas" class="text-slate-500 text-xs mt-0.5">{{ s.kelas }}</p>
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <div v-if="s.tagihan && getTagihanAktif(s).length > 0"
                                            class="flex flex-col items-end gap-0.5">
                                            <span class="text-amber-400 font-mono text-xs font-semibold">
                                                Rp {{ formatRupiah(getTotalTagihanAktif(s)) }}
                                            </span>
                                            <span class="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                                                {{ getTagihanAktif(s).length }} tagihan
                                            </span>
                                        </div>
                                        <span v-else class="text-emerald-400 text-xs font-medium">✅ Lunas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Panel: Detail & Payment -->
                <div class="flex-1 overflow-y-auto h-full">
                    <div v-if="!selected" class="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div class="text-6xl mb-4">👈</div>
                        <p class="text-slate-400 text-lg font-medium">Pilih siswa dari antrian</p>
                        <p class="text-slate-500 text-sm mt-1">Klik nama siswa di sebelah kiri untuk memproses
                            pembayaran</p>
                    </div>

                    <div v-else class="p-4 lg:p-6 max-w-2xl mx-auto">
                        <!-- Student Info Card -->
                        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 mb-6">
                            <div class="flex items-start gap-4">
                                <div
                                    class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                                    {{ getInitials(selected.nama) }}
                                </div>
                                <div class="flex-1">
                                    <h2 class="text-white text-lg font-semibold">{{ selected.nama }}</h2>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <span
                                            class="bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-mono">{{
                                                selected.nis }}</span>
                                        <span class="bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-lg text-xs">{{
                                            selected.kelas || '-' }}</span>
                                        <span class="bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-lg text-xs">{{
                                            selected.tahun_ajaran || '-' }}</span>
                                    </div>
                                </div>
                                <button @click="selected = null; resetPaymentState()"
                                    class="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Tagihan List -->
                        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-6">
                            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h3 class="text-white font-semibold text-sm">📋 Pilih Tagihan yang Akan Dibayar</h3>
                                <div v-if="tagihanBelumLunas.length > 0" class="flex flex-wrap gap-2">
                                    <button type="button" @click="selectAllTagihan"
                                        class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/20">
                                        ☑ Pilih Semua
                                    </button>
                                    <button type="button" @click="clearAllTagihan"
                                        class="rounded-lg border border-slate-600 bg-slate-900/40 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white">
                                        ☐ Clear
                                    </button>
                                </div>
                            </div>

                            <!-- Summary Stats - Compact Horizontal -->
                            <div class="flex gap-2 mb-3">
                                <div class="flex-1 bg-slate-900/50 rounded-lg p-2 text-center">
                                    <p class="text-[10px] text-slate-400">Total</p>
                                    <p class="text-sm font-bold text-white">{{ selected.tagihan?.length || 0 }}</p>
                                </div>
                                <div class="flex-1 bg-emerald-500/10 rounded-lg p-2 text-center">
                                    <p class="text-[10px] text-emerald-400">Lunas</p>
                                    <p class="text-sm font-bold text-emerald-400">{{ tagihanLunas.length }}</p>
                                </div>
                                <div class="flex-1 bg-amber-500/10 rounded-lg p-2 text-center">
                                    <p class="text-[10px] text-amber-400">Belum</p>
                                    <p class="text-sm font-bold text-amber-400">{{ tagihanBelumLunas.length }}</p>
                                </div>
                                <div class="flex-1 bg-cyan-500/10 rounded-lg p-2 text-center">
                                    <p class="text-[10px] text-cyan-400">Dipilih</p>
                                    <p class="text-sm font-bold text-cyan-400">{{ dipilihTagihan.length }}</p>
                                </div>
                            </div>

                            <!-- Tagihan Grid Cards -->
                            <div v-if="selected.tagihan && selected.tagihan.length > 0"
                                class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                <div v-for="t in selected.tagihan" :key="t.id || t.nama"
                                    @click="toggleTagihanCheckout(t)" :class="[
                                        'rounded-xl border p-2.5 transition-all duration-200',
                                        t.is_locked
                                            ? 'border-slate-700/30 bg-slate-900/20 opacity-60 cursor-not-allowed'
                                            : dipilihTagihan.includes(t.id)
                                                ? 'border-cyan-500/60 bg-cyan-500/10 shadow-sm shadow-cyan-500/10 cursor-pointer hover:bg-cyan-500/20'
                                                : 'border-slate-700/60 bg-slate-900/40 cursor-pointer hover:border-slate-500/60 hover:bg-slate-800/50'
                                    ]">
                                    <!-- Header: Checkbox & Status -->
                                    <div class="flex items-start justify-between gap-1 mb-1.5">
                                        <div class="min-w-0 flex-1">
                                            <p class="text-xs font-medium text-white truncate">{{ t.nama }}</p>
                                        </div>

                                        <!-- Checkbox atau Lock Icon -->
                                        <div v-if="!t.is_locked" :class="[
                                            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px]',
                                            dipilihTagihan.includes(t.id) ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-600 text-slate-500'
                                        ]">
                                            <svg v-if="dipilihTagihan.includes(t.id)" class="h-2.5 w-2.5" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div v-else
                                            class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                            <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <!-- Status Badge -->
                                    <div class="mb-1.5">
                                        <span :class="[
                                            'px-1.5 py-0.5 rounded text-[9px] font-semibold',
                                            t.status === 'lunas' ? 'bg-emerald-500/20 text-emerald-400' :
                                                t.status === 'cicil' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-red-500/20 text-red-400'
                                        ]">
                                            {{ t.status_label }}
                                        </span>
                                    </div>

                                    <!-- Nominal -->
                                    <div class="flex items-center justify-between text-[10px]">
                                        <span class="text-slate-500">Rp</span>
                                        <span class="font-mono font-semibold text-amber-400">{{ formatRupiah(t.nominal)
                                        }}</span>
                                    </div>

                                    <!-- Progress bar untuk cicilan -->
                                    <div v-if="t.total_dibayar > 0" class="mt-2 space-y-0.5">
                                        <div class="h-1 w-full rounded-full bg-slate-700/30">
                                            <div :class="[
                                                'h-1 rounded-full transition-all',
                                                t.status === 'lunas' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                                    'bg-gradient-to-r from-cyan-500 to-blue-500'
                                            ]" :style="{ width: ((t.total_dibayar / t.nominal) * 100) + '%' }"></div>
                                        </div>
                                        <div class="flex justify-between text-[9px]">
                                            <span class="text-slate-500">Dibayar: {{
                                                formatRupiahSingkat(t.total_dibayar) }}</span>
                                            <span v-if="t.sisa > 0" class="text-amber-400">Sisa: {{
                                                formatRupiahSingkat(t.sisa) }}</span>
                                            <span v-else class="text-emerald-400">Lunas</span>
                                        </div>
                                    </div>

                                    <!-- Lock message -->
                                    <div v-if="t.is_locked"
                                        class="mt-1.5 flex items-center gap-1 text-[9px] text-emerald-400">
                                        <span>🔒</span> Sudah lunas
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-8">
                                <div class="text-3xl mb-2">✅</div>
                                <p class="text-emerald-400 text-sm font-medium">Semua tagihan siswa ini sudah lunas</p>
                            </div>
                        </div>

                        <!-- Payment Form -->
                        <div v-if="dipilihTagihan.length > 0"
                            class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
                            <!-- Payment Method -->
                            <div class="mb-5">
                                <h3 class="text-white font-semibold text-sm mb-3">💳 Metode Pembayaran</h3>
                                <div class="grid grid-cols-3 gap-3">
                                    <button v-for="m in metodePembayaran" :key="m.val" @click="metodeBayar = m.val"
                                        :class="[
                                            'p-3 rounded-xl text-center transition-all duration-200 border-2',
                                            metodeBayar === m.val
                                                ? 'bg-cyan-500/10 border-cyan-500 text-white'
                                                : 'bg-slate-900/30 border-transparent hover:border-slate-600/30 text-slate-400'
                                        ]">
                                        <div class="text-2xl mb-1">{{ m.icon }}</div>
                                        <div class="text-xs font-medium">{{ m.label }}</div>
                                    </button>
                                </div>
                            </div>

                            <!-- Cicil Details -->
                            <div v-if="metodeBayar === 'cicil'" class="mb-5 space-y-3">
                                <div>
                                    <label class="block text-slate-400 text-xs font-medium mb-1">
                                        Nominal Cicilan Sekarang
                                    </label>
                                    <input v-model.number="nominalCicil" type="number" + :max="totalPembayaran" min="0"
                                        placeholder="Masukkan jumlah yang dibayar..."
                                        class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono" />
                                </div>
                                <div class="flex justify-between text-xs px-1">
                                    <span class="text-slate-400">Sisa tagihan setelah cicilan:</span>
                                    <span :class="sisaCicil < 0 ? 'text-red-400' : 'text-amber-400'"
                                        class="font-mono font-semibold">
                                        Rp {{ formatRupiah(Math.max(0, sisaCicil)) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Total -->
                            <div
                                class="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 mb-5">
                                <div class="flex items-center justify-between">
                                    <span class="text-slate-400 text-sm">Total Pembayaran</span>
                                    <span class="text-amber-400 font-bold text-lg font-mono">Rp {{
                                        formatRupiah(totalPembayaran) }}</span>
                                </div>
                                <div class="text-slate-500 text-xs mt-1">{{ dipilihTagihan.length }} tagihan dipilih
                                </div>
                            </div>

                            <!-- Password Confirmation - Hanya jika RFID TIDAK aktif -->
                            <div v-if="!konfirmasiSelesai && !rfidActive" class="space-y-3">
                                <div class="bg-slate-900/30 border border-slate-700/30 rounded-lg p-3 mb-3">
                                    <p class="text-slate-400 text-xs">🔐 Verifikasi password diperlukan untuk
                                        melanjutkan pembayaran</p>
                                </div>

                                <div>
                                    <label class="block text-slate-400 text-xs font-medium mb-1">Password
                                        Konfirmasi</label>
                                    <div class="relative">
                                        <input v-model="passwordKonfirmasi"
                                            :type="showKonfirmasiPass ? 'text' : 'password'"
                                            placeholder="Masukkan password..." @keydown.enter="konfirmasiPassword"
                                            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                                        <button @click="showKonfirmasiPass = !showKonfirmasiPass"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                            {{ showKonfirmasiPass ? '🙈' : '👁️' }}
                                        </button>
                                    </div>
                                </div>

                                <Transition name="fade">
                                    <div v-if="errorKonfirmasi"
                                        class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                                        {{ errorKonfirmasi }}
                                    </div>
                                </Transition>

                                <button @click="konfirmasiPassword"
                                    class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all">
                                    🔐 Konfirmasi Password
                                </button>
                            </div>

                            <!-- RFID Active - Konfirmasi Otomatis -->
                            <div v-else-if="!konfirmasiSelesai && rfidActive" class="space-y-3">
                                <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <p class="text-cyan-400 text-sm font-semibold">Mode RFID Aktif</p>
                                    </div>
                                    <p class="text-slate-400 text-xs">Password konfirmasi tidak diperlukan. Pembayaran
                                        dapat langsung diproses.</p>
                                </div>

                                <button @click="konfirmasiOtomatis"
                                    class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all">
                                    🔓 Lanjutkan Pembayaran (Auto)
                                </button>
                            </div>

                            <!-- Process Payment (Setelah Konfirmasi) -->
                            <div v-else>
                                <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4">
                                    <p class="text-emerald-400 text-xs">✅ Pembayaran siap diproses</p>
                                </div>

                                <button @click="prosesPembayaran" :disabled="isProcessing"
                                    class="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                    <svg v-if="isProcessing" class="animate-spin w-5 h-5" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span v-else>✅ Proses Pembayaran — Rp {{ formatRupiah(totalPembayaran) }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transaction History -->
            <div v-if="riwayatTransaksi.length > 0" class="border-t border-slate-700/50 bg-slate-800/30">
                <div class="p-4 lg:px-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-white font-semibold text-sm">📊 Transaksi Hari Ini</h3>
                        <span class="bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{{
                            riwayatTransaksi.length }}</span>
                    </div>

                    <div class="overflow-x-auto">
                        <div class="min-w-[700px]">
                            <div
                                class="grid grid-cols-6 gap-4 px-4 py-2 bg-slate-800/50 rounded-lg text-xs text-slate-400 font-medium uppercase tracking-wider">
                                <div>Waktu</div>
                                <div>Siswa</div>
                                <div>Tagihan</div>
                                <div>Metode</div>
                                <div>Total</div>
                                <div>Status</div>
                            </div>

                            <div class="divide-y divide-slate-700/30">
                                <div v-for="r in riwayatTransaksi" :key="r.id"
                                    class="grid grid-cols-6 gap-4 px-4 py-3 text-sm hover:bg-slate-800/30 transition-colors">
                                    <div class="text-slate-400 font-mono">{{ r.waktu }}</div>
                                    <div class="text-white">{{ r.nama_siswa }}</div>
                                    <div class="text-slate-300 text-xs">{{ r.detail }}</div>
                                    <div><span class="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs">{{
                                        r.metode }}</span></div>
                                    <div class="text-amber-400 font-mono font-semibold">Rp {{ formatRupiah(r.total) }}
                                    </div>
                                    <div><span
                                            class="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">sukses</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Toast Notification -->
            <Transition name="slide-up">
                <div v-if="toastMessage.show" :class="[
                    'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium',
                    toastMessage.type === 'success' ? 'bg-emerald-500 text-white' :
                        toastMessage.type === 'error' ? 'bg-red-500 text-white' :
                            'bg-cyan-500 text-white'
                ]">
                    {{ toastMessage.text }}
                </div>
            </Transition>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useApi } from '../composables/useApi.js'

const { bayar } = useApi()
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'smkmutuwsb'

// Props
const props = defineProps({
    rfidActive: {
        type: Boolean,
        default: false
    }
})

// Auth
const unlocked = ref(false)
const passInput = ref('')
const showPass = ref(false)
const lockError = ref('')
const passRef = ref(null)

// UI State
const searchQuery = ref('')
const selected = ref(null)
const dipilihTagihan = ref([])
const metodeBayar = ref('cash')
const buktiTransfer = ref('')
const isProcessing = ref(false)
const toastMessage = ref({ show: false, text: '', type: 'info' })

// Confirmation
const konfirmasiSelesai = ref(false)
const passwordKonfirmasi = ref('')
const showKonfirmasiPass = ref(false)
const errorKonfirmasi = ref('')

// Data
const antrian = ref([])
const riwayatTransaksi = ref([])
const waktu = ref('')

// Payment Methods
const metodePembayaran = [
    { val: 'cash', label: 'Tunai', icon: '💵' },
    { val: 'cicil', label: 'Cicil', icon: '📅' }
]

const nominalCicil = ref(0)
const sisaCicil = computed(() => totalPembayaran.value - Number(nominalCicil.value || 0))

// Helper function untuk konversi aman ke string
function toSafeString(value) {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return ''
}

// Computed
const filteredAntrian = computed(() => {
    if (!searchQuery.value || !searchQuery.value.trim()) {
        return antrian.value
    }

    const query = toSafeString(searchQuery.value).toLowerCase().trim()

    return antrian.value.filter(siswa => {
        const nama = toSafeString(siswa.nama).toLowerCase()
        const nis = toSafeString(siswa.nis).toLowerCase()

        return nama.includes(query) || nis.includes(query)
    })
})

const totalPembayaran = computed(() => {
    if (!selected.value?.tagihan) return 0
    return selected.value.tagihan
        .filter(t => dipilihTagihan.value.includes(t.id))
        .reduce((sum, t) => sum + Number(t.nominal || 0), 0)
})

const tagihanLunas = computed(() => {
    if (!selected.value?.tagihan) return []
    return selected.value.tagihan.filter(t => t.status === 'lunas')
})

const tagihanBelumLunas = computed(() => {
    if (!selected.value?.tagihan) return []
    return selected.value.tagihan.filter(t => t.status !== 'lunas')
})

// Methods
function getInitials(name) {
    if (!name) return '?'
    const safeName = toSafeString(name)
    return safeName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function formatRupiah(amount) {
    return Number(amount || 0).toLocaleString('id-ID')
}

function formatRupiahSingkat(amount) {
    const num = Number(amount || 0)
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
}

function getTagihanAktif(siswa) {
    if (!siswa?.tagihan) return []
    return siswa.tagihan.filter(t => t.status !== 'lunas')
}

function getTotalTagihanAktif(siswa) {
    return getTagihanAktif(siswa).reduce((sum, t) => sum + Number(t.sisa || 0), 0)
}

// Search methods
function handleSearch() {
    // Filtering sudah otomatis via computed property
}

function clearSearch() {
    searchQuery.value = ''
}

// Tambah siswa ke antrian
function tambahAntrian(siswa) {
    const existingIndex = antrian.value.findIndex(s => s.id === siswa.id)
    if (existingIndex > -1) {
        antrian.value[existingIndex] = { ...antrian.value[existingIndex], ...siswa }
    } else {
        antrian.value.push(siswa)
    }
    showToast(`📥 ${siswa.nama} masuk antrian`, 'info')
}

// Set RFID mode dari parent
function setRfidMode(status) {
    // Props sudah reactive, tidak perlu diset manual
    // Fungsi ini disediakan untuk dipanggil dari parent jika diperlukan
    // console.log('RFID mode:', status)
}

// Pilih siswa dari antrian
function pilihSiswa(siswa) {
    selected.value = siswa
    resetPaymentState()
    dipilihTagihan.value = siswa.tagihan
        ?.filter(t => !t.is_locked && t.status !== 'lunas')
        .map(t => t.id) || []
}

function toggleTagihanCheckout(tagihan) {
    if (tagihan.is_locked || tagihan.status === 'lunas') {
        showToast('🔒 Tagihan ini sudah lunas, tidak dapat dipilih', 'info')
        return
    }

    const index = dipilihTagihan.value.indexOf(tagihan.id)
    if (index > -1) {
        dipilihTagihan.value.splice(index, 1)
    } else {
        dipilihTagihan.value.push(tagihan.id)
    }
    konfirmasiSelesai.value = false
    passwordKonfirmasi.value = ''
    errorKonfirmasi.value = ''
}

function selectAllTagihan() {
    dipilihTagihan.value = (selected.value?.tagihan || [])
        .filter(t => !t.is_locked && t.status !== 'lunas')
        .map(t => t.id)
    konfirmasiSelesai.value = false
    passwordKonfirmasi.value = ''
    errorKonfirmasi.value = ''
}

function clearAllTagihan() {
    dipilihTagihan.value = []
    konfirmasiSelesai.value = false
    passwordKonfirmasi.value = ''
    errorKonfirmasi.value = ''
}

function unlock() {
    if (passInput.value === ADMIN_PASSWORD) {
        unlocked.value = true
        lockError.value = ''
        passInput.value = ''
        showPass.value = false
    } else {
        lockError.value = 'Password salah. Silakan coba lagi.'
        passInput.value = ''
    }
}

function lockScreen() {
    unlocked.value = false
    selected.value = null
    resetPaymentState()
    searchQuery.value = ''
}

function resetPaymentState() {
    dipilihTagihan.value = []
    metodeBayar.value = 'cash'
    nominalCicil.value = 0
    konfirmasiSelesai.value = false
    passwordKonfirmasi.value = ''
    errorKonfirmasi.value = ''
}

function konfirmasiPassword() {
    if (passwordKonfirmasi.value === ADMIN_PASSWORD) {
        konfirmasiSelesai.value = true
        errorKonfirmasi.value = ''
        passwordKonfirmasi.value = ''
    } else {
        errorKonfirmasi.value = 'Password salah. Silakan coba lagi.'
        passwordKonfirmasi.value = ''
    }
}

// Konfirmasi otomatis saat RFID aktif
function konfirmasiOtomatis() {
    konfirmasiSelesai.value = true
    errorKonfirmasi.value = ''
    passwordKonfirmasi.value = ''
    showToast('🔓 Konfirmasi otomatis - Mode RFID aktif', 'info')
}

async function prosesPembayaran() {
    if (isProcessing.value) return

    if (metodeBayar.value === 'cicil' && (!nominalCicil.value || nominalCicil.value <= 0)) {
        showToast('⚠️ Masukkan nominal cicilan terlebih dahulu', 'error')
        return
    }
    if (metodeBayar.value === 'cicil' && nominalCicil.value > totalPembayaran.value) {
        showToast('⚠️ Nominal cicilan melebihi total tagihan', 'error')
        return
    }

    isProcessing.value = true
    try {
        const payload = {
            siswa_id: selected.value.id,
            tagihan_ids: dipilihTagihan.value,
            metode_pembayaran: metodeBayar.value,
            nominal_cicil: metodeBayar.value === 'cicil' ? Number(nominalCicil.value) : null,
            tanggal_bayar: new Date().toISOString().split('T')[0]
        }

        const res = await bayar(payload)

        // Add to history
        riwayatTransaksi.value.unshift({
            id: Date.now(),
            waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            nama_siswa: selected.value.nama,
            detail: `${dipilihTagihan.value.length} tagihan`,
            metode: metodeBayar.value,
            total: totalPembayaran.value,
            status: 'sukses'
        })

        // Remove from queue
        antrian.value = antrian.value.filter(s => s.id !== selected.value.id)

        // Reset
        selected.value = null
        resetPaymentState()

        showToast('✅ Pembayaran berhasil diproses!', 'success')
    } catch (error) {
        showToast('❌ Gagal: ' + (error.message || 'Terjadi kesalahan'), 'error')
    } finally {
        isProcessing.value = false
    }
}

function showToast(text, type = 'info') {
    toastMessage.value = { show: true, text, type }
    setTimeout(() => {
        toastMessage.value.show = false
    }, 4000)
}

function refreshData() {
    showToast('Data diperbarui', 'info')
}

// Expose methods untuk parent component
defineExpose({
    tambahAntrian,
    setRfidMode
})

// Lifecycle
let clockTimer = null

onMounted(() => {
    updateClock()
    clockTimer = setInterval(updateClock, 1000)
    setTimeout(() => passRef.value?.focus(), 300)
})

onUnmounted(() => {
    clearInterval(clockTimer)
})

function updateClock() {
    waktu.value = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
}
</style>